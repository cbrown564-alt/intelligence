import { useEffect, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  MathUtils,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three';
import type { QualityMode } from '@/lib/experience-preferences';

const VERT = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform float uScatter;
uniform vec3 uPointer;
uniform float uPointerForce;
uniform float uPixelRatio;
attribute vec3 aKnot;
attribute vec3 aCloud;
attribute float aRand;
varying float vRand;

vec3 wobble(vec3 p, float t) {
  return vec3(
    sin(p.y * 2.1 + t * 0.7) + sin(p.z * 1.7 + t * 0.5),
    sin(p.z * 2.3 + t * 0.6) + sin(p.x * 1.9 + t * 0.8),
    sin(p.x * 2.0 + t * 0.5) + sin(p.y * 1.8 + t * 0.7)
  ) * 0.07;
}

void main() {
  vRand = aRand;
  vec3 pos = mix(position, aKnot, uMorph);
  pos = mix(pos, aCloud, uScatter);
  pos += wobble(pos, uTime) * (0.4 + aRand);
  pos *= 1.0 + 0.035 * sin(uTime * 0.7 + aRand * 6.2831);

  vec3 toP = pos - uPointer;
  float d = length(toP);
  float f = smoothstep(1.9, 0.0, d) * uPointerForce;
  pos += normalize(toP + vec3(0.0001)) * f * (0.5 + aRand * 1.1);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.0 + aRand * 1.6) * uPixelRatio * (30.0 / -mv.z);
}
`;

const FRAG = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying float vRand;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  if (r > 0.5) discard;
  float alpha = smoothstep(0.5, 0.18, r);
  vec3 col = mix(uColorA, uColorB, smoothstep(0.25, 0.85, vRand));
  col = mix(col, uColorC, step(0.93, vRand));
  col *= 0.75 + vRand * 0.55;
  gl_FragColor = vec4(col, alpha * 0.5);
}
`;

export function HeroVisual({ quality }: { quality: QualityMode }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        antialias: quality === 'full',
        alpha: true,
        powerPreference: quality === 'full' ? 'high-performance' : 'low-power',
      });
    } catch {
      mount.dataset.webgl = 'unavailable';
      const message = document.createElement('p');
      message.className = 'visual-unavailable';
      message.setAttribute('role', 'status');
      message.textContent = 'The particle study is unavailable. The essay continues below.';
      mount.appendChild(message);
      return () => {
        delete mount.dataset.webgl;
        message.remove();
      };
    }

    const scene = new Scene();
    const camera = new PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 7;

    const maxDpr = quality === 'full' ? 2 : 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const isSmall = mount.clientWidth < 768;
    const count = quality === 'full' ? (isSmall ? 14000 : 28000) : isSmall ? 6000 : 12000;
    const sphere = new Float32Array(count * 3);
    const knot = new Float32Array(count * 3);
    const cloud = new Float32Array(count * 3);
    const rand = new Float32Array(count);

    const radius = 2.35;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radial = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const jitteredRadius = radius + (Math.random() - 0.5) * 0.12;
      sphere[i * 3] = Math.cos(theta) * radial * jitteredRadius;
      sphere[i * 3 + 1] = y * jitteredRadius;
      sphere[i * 3 + 2] = Math.sin(theta) * radial * jitteredRadius;

      const u = Math.random() * Math.PI * 2;
      const rr = 2 + Math.cos(3 * u);
      const jitter = () => (Math.random() - 0.5) * 0.28;
      knot[i * 3] = rr * Math.cos(2 * u) * 0.78 + jitter();
      knot[i * 3 + 1] = rr * Math.sin(2 * u) * 0.78 + jitter();
      knot[i * 3 + 2] = -Math.sin(3 * u) * 0.78 + jitter();

      cloud[i * 3] = (Math.random() - 0.5) * 11;
      cloud[i * 3 + 1] = (Math.random() - 0.5) * 6.5;
      cloud[i * 3 + 2] = (Math.random() - 0.5) * 5;
      rand[i] = Math.random();
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(sphere, 3));
    geometry.setAttribute('aKnot', new BufferAttribute(knot, 3));
    geometry.setAttribute('aCloud', new BufferAttribute(cloud, 3));
    geometry.setAttribute('aRand', new BufferAttribute(rand, 1));

    const material = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uScatter: { value: 0 },
        uPointer: { value: new Vector3(999, 999, 0) },
        uPointerForce: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, maxDpr) },
        uColorA: { value: new Color('#e8b36a') },
        uColorB: { value: new Color('#8b7cff') },
        uColorC: { value: new Color('#6fe0c3') },
      },
    });

    const points = new Points(geometry, material);
    scene.add(points);

    const pointer = new Vector3(999, 999, 0);
    let pointerForce = 0;
    let scatter = 0;
    let visible = true;

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      const worldHeight = 2 * Math.tan(MathUtils.degToRad(55 / 2)) * 7;
      const worldWidth = worldHeight * (rect.width / rect.height);
      pointer.set((nx * worldWidth) / 2, (ny * worldHeight) / 2, 0);
      pointerForce = 1;
    };
    const onPointerLeave = () => {
      pointerForce = 0;
    };
    const onScroll = () => {
      scatter = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.85)));
    };
    const onResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerdown', onPointerMove);
    mount.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      mount.dataset.rendering = String(visible);
      renderer.domElement.style.visibility = visible ? 'visible' : 'hidden';
    });
    observer.observe(mount);

    const start = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!visible || document.hidden) return;
      const time = (now - start) / 1000;
      const uniforms = material.uniforms;
      uniforms.uTime.value = time;
      const morphTarget = 0.5 + 0.5 * Math.sin(time * 0.22);
      uniforms.uMorph.value += (morphTarget - uniforms.uMorph.value) * 0.02;
      uniforms.uScatter.value += (scatter - uniforms.uScatter.value) * 0.06;
      uniforms.uPointer.value.lerp(pointer, 0.12);
      uniforms.uPointerForce.value +=
        (pointerForce - uniforms.uPointerForce.value) * 0.08;
      points.rotation.y = Math.sin(time * 0.1) * 0.18;
      points.rotation.x = Math.cos(time * 0.08) * 0.08;
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      delete mount.dataset.rendering;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerdown', onPointerMove);
      mount.removeEventListener('pointerleave', onPointerLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [quality]);

  return <div ref={mountRef} className="hero-visual touch-pan" aria-hidden="true" />;
}
