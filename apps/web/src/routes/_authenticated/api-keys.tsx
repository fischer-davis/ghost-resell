import { createFileRoute } from '@tanstack/react-router';
import { Key, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { ApiKeyTable } from '@/components/api-keys/api-key-table';
import { ApiKeyStats } from '@/components/api-keys/api-key-stats';
import { ApiSecurityInfo } from '@/components/api-keys/api-security-info';
import { CreateApiKeyDialog } from '@/components/api-keys/create-api-key-dialog';
import { ApiKeySuccessDialog } from '@/components/api-keys/api-key-success-dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from "@/utils/trpc";

export const Route = createFileRoute('/_authenticated/api-keys')({
  component: ApiKeys,
});

export default function ApiKeys() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [createdApiKey, setCreatedApiKey] = useState<{ key: string; name: string } | null>(null);

  const trpc = useTRPC();

  const { data: keys, isLoading } = useQuery(trpc.apiKey.listApiKeys.queryOptions());
  const apiKeys = trpc.apiKey.listApiKeys.queryKey();
  const statsKey = trpc.apiKey.getApiKeyStats.queryKey();

  const createApiKeyMutation = useMutation(
    trpc.apiKey.createApiKey.mutationOptions(
      {
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries({ queryKey: apiKeys });
          queryClient.invalidateQueries({ queryKey: statsKey });
          setCreatedApiKey({ key: data.key, name: variables.name });
          setCreateDialogOpen(false);
          setSuccessDialogOpen(true);
        },
        onError: (error) => {
          toast.error('Error creating API key', {
            description: error.message,
          });
        },
      }
    ),
  );

  const revokeApiKeyMutation = useMutation(
    trpc.apiKey.revokeApiKey.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
        toast.success('API Key Revoked');
      },
      onError: (error) => {
        toast.error('Error revoking API key', {
          description: error.message,
        });
      },
    }),
  );

  const filteredKeys = useMemo(() => {
    if (!keys) return [];
    return keys.filter((key) => {
      return key.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [keys, searchQuery]);

  return (
    <div className="flex-1 space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your API keys for programmatic access to ghost-drop
          </p>
        </div>
        <CreateApiKeyDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreateApiKey={createApiKeyMutation.mutate}
        />
      </div>

      {/* Stats Cards */}
      <ApiKeyStats keys={keys || []} />

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>API Key Management</CardTitle>
          <CardDescription>
            Create, view, and manage your API keys for programmatic access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                className="max-w-sm"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search API keys..."
                value={searchQuery}
              />
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery('')}
                  size="sm"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Table with Pagination */}
      {isLoading ? (
        <p>Loading...</p>
      ) : filteredKeys.length > 0 ? (
        <ApiKeyTable
          data={filteredKeys}
          onDeleteApiKey={(id) => revokeApiKeyMutation.mutate({ id })}
        />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Key className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-lg">No API keys found</h3>
            <p className="mb-4 text-center text-muted-foreground">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Create your first API key to start using the ghost-drop API'}
            </p>
            {!searchQuery && (
              <CreateApiKeyDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onCreateApiKey={createApiKeyMutation.mutate}
                buttonText="Create Your First API Key"
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* API Documentation Card */}
      <ApiSecurityInfo />

      {/* Success Dialog */}
      {createdApiKey && (
        <ApiKeySuccessDialog
          open={successDialogOpen}
          onOpenChange={setSuccessDialogOpen}
          apiKey={createdApiKey.key}
          keyName={createdApiKey.name}
        />
      )}
    </div>
  );
}
