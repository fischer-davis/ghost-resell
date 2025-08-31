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
import { useTRPC } from '@/utils/trpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

interface SetupStorageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SetupStorageDialog({ open, onOpenChange }: SetupStorageDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Form state
  const [shelfName, setShelfName] = useState('');
  const [shelfDescription, setShelfDescription] = useState('');
  const [binName, setBinName] = useState('');
  const [binDescription, setBinDescription] = useState('');

  // Mutations
  const createShelfMutation = useMutation(
    trpc.inventory.createShelf.mutationOptions({
      onSuccess: async (data) => {
        if (binName) {
          // Create bin for the shelf
          createBinMutation.mutate({
            shelfId: data.shelf.id,
            name: binName,
            description: binDescription || undefined,
          });
        } else {
          // Just refresh and close
          queryClient.invalidateQueries({
            queryKey: trpc.inventory.getShelves.queryKey(),
          });
          toast.success('Storage location created');
          resetForm();
          onOpenChange(false);
        }
      },
      onError: (error) => {
        toast.error('Failed to create shelf', {
          description: error.message,
        });
      },
    })
  );

  const createBinMutation = useMutation(
    trpc.inventory.createBin.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.inventory.getShelves.queryKey(),
        });
        toast.success('Storage location created');
        resetForm();
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error('Failed to create bin', {
          description: error.message,
        });
      },
    })
  );

  const resetForm = () => {
    setShelfName('');
    setShelfDescription('');
    setBinName('');
    setBinDescription('');
  };

  const handleSubmit = () => {
    if (!shelfName) {
      toast.error('Please enter a shelf name');
      return;
    }

    createShelfMutation.mutate({
      name: shelfName,
      description: shelfDescription || undefined,
    });
  };

  const createDefaultSetup = () => {
    // Create a default setup with common storage locations
    const defaultShelves = [
      { name: 'Shelf A', description: 'Main storage shelf', bins: ['Bin 1', 'Bin 2', 'Bin 3'] },
      { name: 'Shelf B', description: 'Secondary storage', bins: ['Bin 1', 'Bin 2'] },
    ];

    // For simplicity, let's just create the first shelf with bins
    setShelfName('Shelf A');
    setShelfDescription('Main storage shelf');
    setBinName('Bin 1');
    setBinDescription('First bin');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Setup Storage Location</DialogTitle>
          <DialogDescription>
            Create your first shelf and bin to organize your inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shelfName" className="text-right">
              Shelf Name *
            </Label>
            <Input
              id="shelfName"
              value={shelfName}
              onChange={(e) => setShelfName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Shelf A"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shelfDescription" className="text-right">
              Description
            </Label>
            <Input
              id="shelfDescription"
              value={shelfDescription}
              onChange={(e) => setShelfDescription(e.target.value)}
              className="col-span-3"
              placeholder="Optional description"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="binName" className="text-right">
              Bin Name
            </Label>
            <Input
              id="binName"
              value={binName}
              onChange={(e) => setBinName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Bin 1"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="binDescription" className="text-right">
              Bin Description
            </Label>
            <Input
              id="binDescription"
              value={binDescription}
              onChange={(e) => setBinDescription(e.target.value)}
              className="col-span-3"
              placeholder="Optional description"
            />
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2">
          <div className="flex space-x-2 w-full">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={createShelfMutation.isPending || createBinMutation.isPending}
              className="flex-1"
            >
              {(createShelfMutation.isPending || createBinMutation.isPending) ? 'Creating...' : 'Create'}
            </Button>
          </div>
          <Button 
            variant="secondary" 
            onClick={createDefaultSetup}
            className="w-full"
          >
            Use Default Setup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}