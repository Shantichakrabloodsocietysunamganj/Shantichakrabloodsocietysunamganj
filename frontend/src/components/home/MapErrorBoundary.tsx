"use client";

import React from "react";

/**
 * If the WebGL 3D map fails to render (no WebGL, low-end device, runtime error),
 * fall back to the reliable SVG map so the hero is never empty.
 */
export default class MapErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.warn("3D map unavailable — using SVG fallback.", error);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
