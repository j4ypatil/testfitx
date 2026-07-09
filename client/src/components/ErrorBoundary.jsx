import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-sm text-center">
            <h1 className="text-4xl font-bold text-foreground tracking-tight mb-4">FitCal</h1>
            <p className="text-[#ff453a] text-sm mb-2">Something went wrong</p>
            <p className="text-dark-muted text-xs mb-6 break-all">{this.state.error.message}</p>
            <button
              onClick={() => { this.setState({ error: null }); window.location.reload(); }}
              className="px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
