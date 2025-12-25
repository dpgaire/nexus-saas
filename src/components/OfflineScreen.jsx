import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {  Globe, RefreshCw, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useState, useEffect } from "react";

const OfflineScreen = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg shadow-2xl border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <WifiOff className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-red-600">
            No internet connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="default">
            <Globe className="h-4 w-4" />
            <AlertTitle>You're offline</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Your device is not connected to the internet. Please check your network and try again.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button onClick={handleRetry} className="flex-1" disabled={!isOnline}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {isOnline ? "Retry now" : "Waiting for connection..."}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineScreen;