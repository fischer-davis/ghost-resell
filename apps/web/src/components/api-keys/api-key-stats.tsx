import { Activity, AlertTriangle, Key } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from "@/utils/trpc";

export function ApiKeyStats() {
  const trpc = useTRPC();
  const { data: stats } = useQuery(trpc.apiKey.getApiKeyStats.queryOptions());

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">
            Total API Keys
          </CardTitle>
          <Key className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats?.totalKeys ?? 0}</div>
          <p className="text-muted-foreground text-xs">
            <span className="text-green-600">
              {stats?.activeKeys ?? 0}
            </span>{' '}
            active
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">
            Total API Calls
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            {stats?.totalUsage.toLocaleString() ?? 0}
          </div>
          <p className="text-muted-foreground text-xs">across all keys</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Expiring Soon</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            {stats?.expiringSoon ?? 0}
          </div>
          <p className="text-muted-foreground text-xs">within 30 days</p>
        </CardContent>
      </Card>
    </div>
  );
}
