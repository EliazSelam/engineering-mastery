import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  simName?: string;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class SimErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[SimErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-8 text-center" dir="rtl">
          <AlertTriangle className="h-10 w-10 text-red-400" />
          <div>
            <p className="font-bold text-red-700 text-base mb-1">
              {this.props.simName ?? 'הסימולציה'} נתקלה בשגיאה
            </p>
            <p className="text-red-500 text-sm">התוכן התיאורטי עדיין זמין למטה.</p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, errorMessage: '' })}
            className="flex items-center gap-2 rounded-full border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            נסה שוב
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default SimErrorBoundary;
