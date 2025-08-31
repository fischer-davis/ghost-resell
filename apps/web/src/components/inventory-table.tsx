import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTRPC } from '@/utils/trpc';
import { useQuery } from '@tanstack/react-query';
import { MoreHorizontal, Package, ShoppingCart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InventoryTableProps {
  onMarkSold: (instanceId: number) => void;
  onEdit: (instanceId: number) => void;
}

export function InventoryTable({ onMarkSold, onEdit }: InventoryTableProps) {
  const trpc = useTRPC();
  
  const { data: inventory, isLoading, refetch } = useQuery(
    trpc.inventory.getInventory.queryOptions({
      status: 'all',
    })
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading inventory...</div>
      </div>
    );
  }

  if (!inventory || inventory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No inventory items</h3>
        <p className="text-muted-foreground mb-4">
          Get started by adding your first item to inventory
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="default">Available</Badge>;
      case 'sold':
        return <Badge variant="destructive">Sold</Badge>;
      case 'reserved':
        return <Badge variant="secondary">Reserved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: string | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(amount));
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Listing Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Sold Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((instance) => (
            <TableRow key={instance.id}>
              <TableCell className="font-medium">
                <div>
                  <div className="font-semibold">{instance.item?.title}</div>
                  {instance.item?.description && (
                    <div className="text-sm text-muted-foreground">
                      {instance.item.description.length > 50
                        ? `${instance.item.description.substring(0, 50)}...`
                        : instance.item.description}
                    </div>
                  )}
                  {instance.item?.category && (
                    <Badge variant="outline" className="mt-1">
                      {instance.item.category}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{instance.item?.condition || '-'}</TableCell>
              <TableCell>{formatCurrency(instance.item?.cost)}</TableCell>
              <TableCell>{formatCurrency(instance.item?.listingPrice)}</TableCell>
              <TableCell>{getStatusBadge(instance.status || 'available')}</TableCell>
              <TableCell>{instance.platform || '-'}</TableCell>
              <TableCell>
                <div className="text-sm">
                  {instance.shelf?.name && (
                    <div>📚 {instance.shelf.name}</div>
                  )}
                  {instance.bin?.name && (
                    <div className="text-muted-foreground">📦 {instance.bin.name}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {instance.status === 'sold' ? formatCurrency(instance.soldPrice) : '-'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(instance.id)}>
                      Edit item
                    </DropdownMenuItem>
                    {instance.status === 'available' && (
                      <DropdownMenuItem onClick={() => onMarkSold(instance.id)}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Mark as sold
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}