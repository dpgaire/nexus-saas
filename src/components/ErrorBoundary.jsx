import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle, Copy, Globe, RefreshCw, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      isDetailsOpen: false,
      copied: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleCopyError = () => {
    const errorText = `${this.state.error?.toString() || "Unknown error"}\n${this.state.error?.stack || ""}`;
    navigator.clipboard.writeText(errorText).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    setTimeout(() => {
      if (this.state.hasError) {
        window.location.reload();
      }
    }, 0);
  };

  toggleDetails = () => {
    this.setState((prev) => ({ isDetailsOpen: !prev.isDetailsOpen }));
  };

  render() {
    if (this.state.hasError) {
      const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

      return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
          <Card className="w-full max-w-lg shadow-2xl border-border">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                {isOffline ? (
                  <WifiOff className="h-10 w-10 text-red-600" />
                ) : (
                  <AlertCircle className="h-10 w-10 text-red-600" />
                )}
              </div>
              <CardTitle className="text-3xl font-bold text-red-600">
                {isOffline ? "No internet connection" : "Something went wrong"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert variant={isOffline ? "default" : "destructive"}>
                {isOffline ? <Globe className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{isOffline ? "You're offline" : "Unexpected error"}</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  {isOffline
                    ? "Your device is not connected to the internet. Please check your network and try again."
                    : "We're sorry for the inconvenience. Our team has been notified."}
                </AlertDescription>
              </Alert>

              {!isOffline && (
                <Collapsible open={this.state.isDetailsOpen} onOpenChange={this.toggleDetails}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {this.state.isDetailsOpen ? "Hide" : "Show"} technical details
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <div className="rounded-md bg-muted p-4">
                      <pre className="text-sm overflow-auto max-h-64 whitespace-pre-wrap">
                        {this.state.error?.toString() || "Unknown error"}
                        {"\n"}
                        {this.state.error?.stack || ""}
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3"
                        onClick={this.handleCopyError}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        {this.state.copied ? "Copied!" : "Copy error"}
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              <div className="flex gap-4">
                <Button onClick={this.handleReset} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isOffline ? "Retry connection" : "Try again"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;