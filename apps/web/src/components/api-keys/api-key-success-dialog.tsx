import { useState } from 'react';
import { Copy, Key, Check } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ApiKeySuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: string;
  keyName: string;
}

export function ApiKeySuccessDialog({
  open,
  onOpenChange,
  apiKey,
  keyName,
}: ApiKeySuccessDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      toast.success('API key copied to clipboard');
      
      // Reset the copy state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy API key to clipboard');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key Created Successfully
          </DialogTitle>
          <DialogDescription>
            Your API key "{keyName}" has been created. Copy it now as it won't be shown again.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key-display" className="text-sm font-medium">
              API Key
            </Label>
            <div className="flex gap-2">
              <Input
                id="api-key-display"
                value={apiKey}
                readOnly
                className="font-mono text-sm bg-muted/50"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="flex-shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/20 p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start space-x-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Important Security Notice
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  This is the only time you'll see your API key. Store it securely and don't share it with anyone. 
                  If you lose it, you'll need to create a new one.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleClose} className="w-full">
            I've Saved My API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}