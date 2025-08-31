import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { SetupStorageDialog } from './setup-storage-dialog';

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PLATFORMS = [
  { id: 'ebay', name: 'eBay' },
  { id: 'mercari', name: 'Mercari' },
  { id: 'etsy', name: 'Etsy' },
  { id: 'facebook', name: 'Facebook Marketplace' },
  { id: 'poshmark', name: 'Poshmark' },
  { id: 'depop', name: 'Depop' },
] as const;

const CONDITIONS = [
  'New',
  'Like New',
  'Very Good',
  'Good',
  'Acceptable',
  'For Parts/Not Working',
] as const;

export function AddItemDialog({ open, onOpenChange }: AddItemDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [selectedShelf, setSelectedShelf] = useState('');
  const [selectedBin, setSelectedBin] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showSetupStorage, setShowSetupStorage] = useState(false);

  // Load shelves and bins
  const { data: shelves } = useQuery(
    trpc.inventory.getShelves.queryOptions()
  );

  const selectedShelfData = shelves?.find(s => s.id.toString() === selectedShelf);

  // Mutations
  const createItemMutation = useMutation(
    trpc.inventory.createItem.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.inventory.getInventory.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.inventory.getInventoryStats.queryKey(),
        });
        toast.success('Item added successfully');
        resetForm();
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error('Failed to add item', {
          description: error.message,
        });
      },
    })
  );

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCost('');
    setListingPrice('');
    setCategory('');
    setCondition('');
    setQuantity('1');
    setSelectedShelf('');
    setSelectedBin('');
    setSelectedPlatforms([]);
  };

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    setSelectedPlatforms(prev => 
      checked 
        ? [...prev, platformId]
        : prev.filter(id => id !== platformId)
    );
  };

  const handleSubmit = () => {
    if (!title || !cost || !listingPrice || !selectedShelf || !selectedBin) {
      toast.error('Please fill in all required fields');
      return;
    }

    createItemMutation.mutate({
      title,
      description: description || undefined,
      cost: Number(cost),
      listingPrice: Number(listingPrice),
      quantity: Number(quantity),
      shelfId: Number(selectedShelf),
      binId: Number(selectedBin),
      category: category || undefined,
      condition: condition || undefined,
      platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Add a new item to your inventory. You can track multiple instances if you have more than one.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Basic Item Info */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Item title"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Item description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Electronics, Clothing, Books"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="condition" className="text-right">
              Condition
            </Label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((cond) => (
                  <SelectItem key={cond} value={cond}>
                    {cond}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cost" className="text-right">
              Cost *
            </Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="col-span-3"
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="listingPrice" className="text-right">
              Listing Price *
            </Label>
            <Input
              id="listingPrice"
              type="number"
              step="0.01"
              value={listingPrice}
              onChange={(e) => setListingPrice(e.target.value)}
              className="col-span-3"
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity *
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="col-span-3"
              placeholder="1"
            />
          </div>

          {/* Storage Location */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shelf" className="text-right">
              Shelf *
            </Label>
            <div className="col-span-3 space-y-2">
              <Select value={selectedShelf} onValueChange={setSelectedShelf}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shelf" />
                </SelectTrigger>
                <SelectContent>
                  {shelves?.map((shelf) => (
                    <SelectItem key={shelf.id} value={shelf.id.toString()}>
                      {shelf.name}
                      {shelf.description && ` - ${shelf.description}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(!shelves || shelves.length === 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSetupStorage(true)}
                >
                  + Create Storage Location
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bin" className="text-right">
              Bin *
            </Label>
            <Select 
              value={selectedBin} 
              onValueChange={setSelectedBin}
              disabled={!selectedShelf}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={selectedShelf ? "Select bin" : "Select shelf first"} />
              </SelectTrigger>
              <SelectContent>
                {selectedShelfData?.bins?.map((bin) => (
                  <SelectItem key={bin.id} value={bin.id.toString()}>
                    {bin.name}
                    {bin.description && ` - ${bin.description}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Platform Selection */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Platforms</Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              {PLATFORMS.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.id}
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={(checked) =>
                      handlePlatformChange(platform.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={platform.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {platform.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={createItemMutation.isPending}
          >
            {createItemMutation.isPending ? 'Adding...' : 'Add Item'}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Setup Storage Dialog */}
      <SetupStorageDialog
        open={showSetupStorage}
        onOpenChange={setShowSetupStorage}
      />
    </Dialog>
  );
}