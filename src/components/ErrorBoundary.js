import { Component } from "react";
import * as Sentry from "@sentry/react";
import { resetSocket } from "../hooks/useSocket";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info.componentStack);
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
    resetSocket();
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        minHeight: "100vh", background: "#050506", display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 32, fontFamily: "var(--fb)",
      }}>
        <div style={{ fontFamily: "var(--fd)", fontSize: 48, color: "#DC2626", letterSpacing: 6, marginBottom: 12 }}>
          BLIND<span style={{ color: "white" }}>SPOT</span>
        </div>
        <div style={{ fontSize: 14, color: "#888", marginBottom: 32, textAlign: "center", maxWidth: 300 }}>
          Something went wrong. Reload the page to rejoin your game.
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "#DC2626", color: "white", border: "none", borderRadius: 12,
            padding: "14px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer",
          }}
        >
          Reload
        </button>
      </div>
    );
  }
}
