import { useState } from 'react';
import { Key, Plus, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface CreateApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateApiKey: (newKey: {
    name: string;
    permissions: string[];
    expiresAt: Date | null;
  }) => void;
  buttonText?: string;
  buttonIcon?: boolean;
}

export function CreateApiKeyDialog({
  open,
  onOpenChange,
  onCreateApiKey,
  buttonText = 'Create API Key',
  buttonIcon = true,
}: CreateApiKeyDialogProps) {
  const [newKeyForm, setNewKeyForm] = useState({
    name: '',
    permissions: [] as string[],
    expiresAt: '',
    neverExpires: false,
  });

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setNewKeyForm({
        ...newKeyForm,
        permissions: [...newKeyForm.permissions, permission],
      });
    } else {
      setNewKeyForm({
        ...newKeyForm,
        permissions: newKeyForm.permissions.filter((p) => p !== permission),
      });
    }
  };

  const handleCreateApiKey = () => {
    onCreateApiKey({
      name: newKeyForm.name,
      permissions: newKeyForm.permissions,
      expiresAt: newKeyForm.neverExpires ? null : new Date(newKeyForm.expiresAt),
    });

    // Reset form
    setNewKeyForm({
      name: '',
      permissions: [],
      expiresAt: '',
      neverExpires: false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          {buttonIcon && <Plus className="h-4 w-4 mr-2" />}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New API Key</DialogTitle>
          <DialogDescription>
            Create a new API key for programmatic access to your files and storage
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* API Key Name */}
          <div className="space-y-2">
            <Label htmlFor="key-name" className="text-sm font-medium">
              API Key Name
            </Label>
            <Input
              id="key-name"
              placeholder="e.g., Production API Key"
              value={newKeyForm.name}
              onChange={(e) => setNewKeyForm({ ...newKeyForm, name: e.target.value })}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Choose a descriptive name to identify this API key</p>
          </div>

          {/* Permissions Section */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Permissions</Label>
              <p className="text-xs text-muted-foreground">Select the permissions this API key should have</p>
            </div>
            <div className="grid gap-3">
              <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card">
                <Checkbox
                  id="read-permission"
                  checked={newKeyForm.permissions.includes('read')}
                  onCheckedChange={(checked) => handlePermissionChange('read', checked as boolean)}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <Label htmlFor="read-permission" className="text-sm font-medium cursor-pointer">
                    Read Access
                  </Label>
                  <p className="text-xs text-muted-foreground">View and download files from your storage</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card">
                <Checkbox
                  id="write-permission"
                  checked={newKeyForm.permissions.includes('write')}
                  onCheckedChange={(checked) => handlePermissionChange('write', checked as boolean)}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <Label htmlFor="write-permission" className="text-sm font-medium cursor-pointer">
                    Write Access
                  </Label>
                  <p className="text-xs text-muted-foreground">Upload new files and modify existing ones</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card">
                <Checkbox
                  id="delete-permission"
                  checked={newKeyForm.permissions.includes('delete')}
                  onCheckedChange={(checked) => handlePermissionChange('delete', checked as boolean)}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <Label htmlFor="delete-permission" className="text-sm font-medium cursor-pointer">
                    Delete Access
                  </Label>
                  <p className="text-xs text-muted-foreground">Permanently remove files from storage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Expiration Section */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Expiration</Label>
              <p className="text-xs text-muted-foreground">Set when this API key should expire for security</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="never-expires"
                  checked={newKeyForm.neverExpires}
                  onCheckedChange={(checked) =>
                    setNewKeyForm({ ...newKeyForm, neverExpires: checked as boolean })
                  }
                />
                <Label htmlFor="never-expires" className="text-sm font-medium cursor-pointer">
                  Never expires
                </Label>
              </div>
              {!newKeyForm.neverExpires && (
                <div className="space-y-2">
                  <Label htmlFor="expiration" className="text-sm font-medium">
                    Expiration Date
                  </Label>
                  <Input
                    id="expiration"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={newKeyForm.expiresAt}
                    onChange={(e) => setNewKeyForm({ ...newKeyForm, expiresAt: e.target.value })}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="rounded-lg bg-muted/50 p-4 border border-muted">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Security Notice</p>
                <p className="text-xs text-muted-foreground">
                  Store your API key securely. It will only be shown once after creation and cannot be recovered
                  if lost.
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateApiKey}
            disabled={!newKeyForm.name || newKeyForm.permissions.length === 0}
          >
            <Key className="h-4 w-4 mr-2" />
            Create API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
