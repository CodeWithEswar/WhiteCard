import React from 'react'
import { AlertCircleIcon, File01Icon, RotateRight01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'

interface MarkdownErrorBoundaryProps {
  children: React.ReactNode
  onViewSource?: () => void
}

interface MarkdownErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class MarkdownErrorBoundary extends React.Component<
  MarkdownErrorBoundaryProps,
  MarkdownErrorBoundaryState
> {
  constructor(props: MarkdownErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): MarkdownErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Markdown rendering error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full flex-1 flex items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full p-6 rounded-2xl border border-border/80 bg-card/90 space-y-4 shadow-sm">
            <div className="size-14 rounded-2xl border border-destructive/20 bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
              <AppIcon icon={AlertCircleIcon} size={28} />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">
                We couldn&apos;t render this Markdown file.
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                {this.state.error?.message || 'An unexpected error occurred while parsing content.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              {this.props.onViewSource && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={this.props.onViewSource}
                  className="h-8 px-3 rounded-xl text-xs gap-1.5 border-border"
                >
                  <AppIcon icon={File01Icon} size={13} />
                  <span>View Source</span>
                </Button>
              )}

              <Button
                size="sm"
                onClick={this.handleRetry}
                className="h-8 px-3 rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
              >
                <AppIcon icon={RotateRight01Icon} size={13} />
                <span>Try Again</span>
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
