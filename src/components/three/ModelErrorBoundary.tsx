"use client";

import { Component, type ReactNode } from "react";

interface ModelErrorBoundaryProps {
  children: ReactNode;
  fallback: (retry: () => void) => ReactNode;
}

interface ModelErrorBoundaryState {
  hasError: boolean;
}

export class ModelErrorBoundary extends Component<
  ModelErrorBoundaryProps,
  ModelErrorBoundaryState
> {
  state: ModelErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ModelErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Log for development; never surface stack traces to the visitor.
    console.error("[SS Holdings] 3D room failed to load:", error);
  }

  private retry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback(this.retry);
    }
    return this.props.children;
  }
}
