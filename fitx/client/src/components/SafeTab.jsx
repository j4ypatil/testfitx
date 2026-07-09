import { Component } from 'react';

export default class SafeTab extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('Tab crash:', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center pt-20 px-6 text-center">
          <p className="text-red-400 font-semibold mb-2">Something went wrong</p>
          <p className="text-dark-muted text-sm mb-4 max-w-xs">{this.state.error?.message || 'Unknown error'}</p>
          <button onClick={() => this.setState({ error: null })} className="text-accent text-sm font-semibold">Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
