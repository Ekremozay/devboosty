'use client';
import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ToolErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="py-12 text-center space-y-3">
          <div className="text-4xl">⚠️</div>
          <p className="font-semibold text-slate-700 dark:text-slate-300">This tool failed to load.</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Try refreshing the page.</p>
          <button
            onClick={() => this.setState({ error: null })}
            className="text-sm text-brand-600 hover:text-brand-700 underline"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
