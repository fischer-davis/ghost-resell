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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTRPC } from '@/utils/trpc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

const PLATFORMS = [
  { id: 'ebay', name: 'eBay' },
  { id: 'mercari', name: 'Mercari' },
  { id: 'etsy', name: 'Etsy' },
  { id: 'facebook', name: 'Facebook Marketplace' },
  { id: 'poshmark', name: 'Poshmark' },
  { id: 'depop', name: 'Depop' },
  { id: 'local', name: 'Local Sale' },
  { id: 'other', name: 'Other' },
] as const;

interface MarkSoldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instanceId: number | null;
}

export function MarkSoldDialog({ open, onOpenChange, instanceId }: MarkSoldDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Form state
  const [soldPrice, setSoldPrice] = useState('');
  const [platform, setPlatform] = useState('');
  const [notes, setNotes] = useState('');

  // Get inventory instance details
  const { data: inventory } = useQuery(
    trpc.inventory.getInventory.queryOptions({
      status: 'all',
    })
  );

  const currentInstance = inventory?.find(item => item.id === instanceId);

  // Mutation
  const markSoldMutation = useMutation(
    trpc.inventory.markItemSold.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.inventory.getInventory.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.inventory.getInventoryStats.queryKey(),
        });
        toast.success('Item marked as sold');
        resetForm();
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error('Failed to mark item as sold', {
          description: error.message,
        });
      },
    })
  );

  const resetForm = () => {
    setSoldPrice('');
    setPlatform('');
    setNotes('');
  };

  const handleSubmit = () => {
    if (!instanceId || !soldPrice || !platform) {
      toast.error('Please fill in all required fields');
      return;
    }

    markSoldMutation.mutate({
      inventoryInstanceId: instanceId,
      soldPrice: Number(soldPrice),
      platform,
      notes: notes || undefined,
    });
  };

  const formatCurrency = (amount: string | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(amount));
  };

  const calculateProfit = () => {
    if (!soldPrice || !currentInstance?.item?.cost) return null;
    const profit = Number(soldPrice) - Number(currentInstance.item.cost);
    return profit;
  };

  const profit = calculateProfit();

  // Pre-fill sold price with listing price when dialog opens
  useState(() => {
    if (open && currentInstance?.item?.listingPrice && !soldPrice) {
      setSoldPrice(currentInstance.item.listingPrice);
    }
  });

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        resetForm();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Item as Sold</DialogTitle>
          <DialogDescription>
            Record the sale details for this inventory item.
          </DialogDescription>
        </DialogHeader>

        {currentInstance && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <h4 className="font-medium">{currentInstance.item?.title}</h4>
            <div className="text-sm text-muted-foreground mt-1">
              <div>Cost: {formatCurrency(currentInstance.item?.cost)}</div>
              <div>Listed: {formatCurrency(currentInstance.item?.listingPrice)}</div>
              <div>Location: {currentInstance.shelf?.name} - {currentInstance.bin?.name}</div>
            </div>
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="soldPrice" className="text-right">
              Sold Price *
            </Label>
            <Input
              id="soldPrice"
              type="number"
              step="0.01"
              value={soldPrice}
              onChange={(e) => setSoldPrice(e.target.value)}
              className="col-span-3"
              placeholder="0.00"
            />
          </div>

          {profit !== null && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-sm text-muted-foreground">
                Profit
              </Label>
              <div className={`col-span-3 text-sm font-medium ${
                profit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {profit >= 0 ? '+' : ''}{formatCurrency(profit.toString())}
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="platform" className="text-right">
              Platform *
            </Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((plat) => (
                  <SelectItem key={plat.id} value={plat.id}>
                    {plat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              placeholder="Optional notes about the sale"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={markSoldMutation.isPending}
          >
            {markSoldMutation.isPending ? 'Marking Sold...' : 'Mark as Sold'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}