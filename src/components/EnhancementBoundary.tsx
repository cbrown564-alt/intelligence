import { Component, type ReactNode } from 'react';

interface EnhancementBoundaryProps {
  children: ReactNode;
  label: string;
  fallback?: ReactNode;
}

interface EnhancementBoundaryState {
  failed: boolean;
}

export class EnhancementBoundary extends Component<
  EnhancementBoundaryProps,
  EnhancementBoundaryState
> {
  state: EnhancementBoundaryState = { failed: false };

  static getDerivedStateFromError(): EnhancementBoundaryState {
    return { failed: true };
  }

  componentDidCatch() {
    // The semantic essay remains available through the supplied fallback.
  }

  render() {
    if (!this.state.failed) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="enhancement-error" role="status">
        <span>{this.props.label} is unavailable. The essay remains readable.</span>
        <button type="button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }
}
