import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InventoryStats } from '@/components/inventory-stats';
import { InventoryTable } from '@/components/inventory-table';
import { AddItemDialog } from '@/components/add-item-dialog';
import { MarkSoldDialog } from '@/components/mark-sold-dialog';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showMarkSoldDialog, setShowMarkSoldDialog] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<number | null>(null);

  const handleMarkSold = (instanceId: number) => {
    setSelectedInstanceId(instanceId);
    setShowMarkSoldDialog(true);
  };

  const handleEdit = (instanceId: number) => {
    // TODO: Implement edit functionality
    console.log('Edit instance:', instanceId);
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your reselling inventory across multiple platforms
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <InventoryStats />

      {/* Inventory Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Inventory Items</h3>
        <InventoryTable 
          onMarkSold={handleMarkSold}
          onEdit={handleEdit}
        />
      </div>

      {/* Dialogs */}
      <AddItemDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
      
      <MarkSoldDialog
        open={showMarkSoldDialog}
        onOpenChange={setShowMarkSoldDialog}
        instanceId={selectedInstanceId}
      />
    </div>
  );
}
