import { useEffect, useRef } from 'react';
import {
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  DynamicDrawUsage,
  Fog,
  InstancedMesh,
  MeshLambertMaterial,
  Object3D,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three';
import { fbm2, lerp, smoothstep } from '@/lib/noise';
import { ChapterHead } from '@/components/ChapterHead';
import { ChapterTradeoff } from '@/components/ChapterTradeoff';
import { CHAPTER_BY_ID } from '@/content/chapters';
import { useExperiencePreferences } from '@/lib/experience-preferences';

export function ShapeshiftChapter() {
  const chapter = CHAPTER_BY_ID.shapeshift;
  const mountRef = useRef<HTMLDivElement>(null);
  const { quality } = useExperiencePreferences();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new Scene();
    scene.fog = new Fog(0x08080d, 16, 52);
    const camera = new PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      120
    );
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
      message.textContent = 'The procedural city is unavailable. The static study remains above.';
      mount.appendChild(message);
      return () => {
        delete mount.dataset.webgl;
        message.remove();
      };
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'full' ? 2 : 1));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    scene.add(new AmbientLight(0x8b7cff, 0.55));
    const sun = new DirectionalLight(0xe8b36a, 1.4);
    sun.position.set(12, 20, 8);
    scene.add(sun);
    const rim = new DirectionalLight(0x6fe0c3, 0.5);
    rim.position.set(-14, 8, -10);
    scene.add(rim);

    const SIDE = quality === 'full' ? 40 : 28;
    const COUNT = SIDE * SIDE;
    const SPACING = 1.05;
    const HALF = (SIDE * SPACING) / 2;

    const geo = new BoxGeometry(0.82, 1, 0.82);
    geo.translate(0, 0.5, 0);
    const mat = new MeshLambertMaterial({});
    const mesh = new InstancedMesh(geo, mat, COUNT);
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    scene.add(mesh);

    const cSand = new Color('#e8b36a');
    const cViolet = new Color('#6f5fff');
    const cSea = new Color('#6fe0c3');
    const tmpColor = new Color();

    const gx = new Float32Array(COUNT);
    const gz = new Float32Array(COUNT);
    const rnd = new Float32Array(COUNT);
    const dustX = new Float32Array(COUNT);
    const dustY = new Float32Array(COUNT);
    const dustZ = new Float32Array(COUNT);

    let idx = 0;
    for (let i = 0; i < SIDE; i++) {
      for (let j = 0; j < SIDE; j++) {
        const x = i * SPACING - HALF;
        const z = j * SPACING - HALF;
        gx[idx] = x;
        gz[idx] = z;
        rnd[idx] = Math.random();
        const a = Math.random() * Math.PI * 2;
        const r = 6 + Math.random() * 14;
        dustX[idx] = Math.cos(a) * r;
        dustY[idx] = 3 + Math.random() * 14;
        dustZ[idx] = Math.sin(a) * r;

        const dc = Math.hypot(x, z) / HALF;
        tmpColor.copy(cSand).lerp(cViolet, smoothstep(0.15, 1, dc));
        if (rnd[idx] > 0.93) tmpColor.copy(cSea);
        mesh.setColorAt(idx, tmpColor);
        idx++;
      }
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // star dust
    const starN = 500;
    const starPos = new Float32Array(starN * 3);
    for (let i = 0; i < starN; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 18 + Math.random() * 30;
      starPos[i * 3] = Math.cos(a) * r;
      starPos[i * 3 + 1] = Math.random() * 24 - 2;
      starPos[i * 3 + 2] = Math.sin(a) * r;
    }
    const starGeo = new BufferGeometry();
    starGeo.setAttribute('position', new BufferAttribute(starPos, 3));
    const starMaterial = new PointsMaterial({
        color: 0xede7da,
        size: 0.06,
        transparent: true,
        opacity: 0.5,
      });
    const stars = new Points(starGeo, starMaterial);
    scene.add(stars);

    const dummy = new Object3D();
    const CYCLE = 22;

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        mount.dataset.rendering = String(visible);
      },
      { threshold: 0.02 }
    );
    io.observe(mount);

    const start = performance.now();
    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      if (document.hidden) return;
      const t = (now - start) / 1000;

      // 0 = city, 1 = dust
      const phase = (t % CYCLE) / CYCLE;
      const u = smoothstep(0.4, 0.56, phase) * (1 - smoothstep(0.84, 0.97, phase));

      for (let i = 0; i < COUNT; i++) {
        const x = gx[i];
        const z = gz[i];
        const dc = Math.hypot(x, z) / HALF;
        const fall = 1 - dc * 0.72;
        const n = fbm2(x * 0.13 + t * 0.05, z * 0.13 - t * 0.03);
        const cityH = Math.max(0.15, (1 + 8.5 * n * n) * fall);

        const delay = rnd[i] * 0.25;
        const ui = smoothstep(0, 1, Math.min(1, Math.max(0, (u - delay) / (1 - delay))));

        const h = lerp(cityH, 0.12, ui);
        dummy.position.set(
          lerp(x, dustX[i], ui),
          lerp(0, dustY[i], ui),
          lerp(z, dustZ[i], ui)
        );
        dummy.scale.set(1, h, 1);
        dummy.rotation.y = ui * rnd[i] * 3;
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;

      const ang = t * 0.07;
      camera.position.set(Math.cos(ang) * 25, 11 + Math.sin(t * 0.11) * 2.5, Math.sin(ang) * 25);
      camera.lookAt(0, 2.5, 0);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      delete mount.dataset.rendering;
      window.removeEventListener('resize', onResize);
      geo.dispose();
      starGeo.dispose();
      starMaterial.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [quality]);

  return (
    <section id="shapeshift" className="relative bg-ink overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 pt-28 md:pt-36">
        <ChapterHead
          title={
            <>
              A city, <em className="text-violet-glow">briefly</em>.
            </>
          }
          lede="Towers rise from dust. Streets hold for a moment. Then the whole structure loosens and begins again."
        />
      </div>

      <div className="relative h-[64vh] md:h-[72vh] mt-6">
        <div
          ref={mountRef}
          className="shapeshift-fallback absolute inset-0 touch-pan"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute bottom-5 left-6 flex items-center gap-3">
          <span className="font-mono-label text-xs tracking-[0.12em] text-paper/70 uppercase">
            local rules becoming a skyline
          </span>
          <span className="h-px w-10 bg-violet-glow/30" />
        </div>
      </div>
      <div className="relative mx-auto max-w-7xl px-6 pb-28 md:pb-36">
        <ChapterTradeoff
          capability={chapter.capability}
          blindSpot={chapter.blindSpot}
        />
      </div>
    </section>
  );
}
