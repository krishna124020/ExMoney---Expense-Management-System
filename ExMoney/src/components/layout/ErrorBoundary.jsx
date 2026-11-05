import React, { Component } from 'react';
import { ErrorState } from '../ui/ErrorState';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // Resetting state will remount children or allow re-render
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 'var(--space-6)' }}>
          <ErrorState 
            title="Application Error" 
            message="An unexpected error occurred in the application."
            onRetry={this.handleRetry} 
          />
        </div>
      );
    }

    return this.props.children;
  }
}
