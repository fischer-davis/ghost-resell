import { Activity, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ApiSecurityInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>API Security & Usage</span>
        </CardTitle>
        <CardDescription>
          Important information about using your API keys securely
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="flex items-center space-x-2 font-medium">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Best Practices</span>
            </h4>
            <ul className="space-y-1 text-muted-foreground text-sm">
              <li>• Store API keys securely in environment variables</li>
              <li>• Use different keys for different environments</li>
              <li>• Regularly rotate your API keys</li>
              <li>• Monitor API key usage and activity</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="flex items-center space-x-2 font-medium">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span>Security Warnings</span>
            </h4>
            <ul className="space-y-1 text-muted-foreground text-sm">
              <li>• Never commit API keys to version control</li>
              <li>• Don't share keys in plain text communications</li>
              <li>• Revoke compromised keys immediately</li>
              <li>• Use minimal required permissions</li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-4">
          <Button className="w-full bg-transparent" variant="outline">
            <Activity className="mr-2 h-4 w-4" />
            View API Documentation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}