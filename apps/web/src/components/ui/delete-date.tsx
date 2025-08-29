import type { Table } from '@tanstack/react-table';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { DatePicker } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteDateProps<TData> {
  table: Table<TData>;
}

const DeleteDate = <TData,>({ table }: DeleteDateProps<TData>) => {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [date, setDate] = useState<Date | undefined>();

  const handleBulkUpdateDeletionDate = () => {};

  return (
    <div>
      <Button
        className="border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
        disabled={!selectedRows.length}
        onClick={() => setShowUpdateDialog(true)}
        variant="outline"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        Update Delete Date
      </Button>
      <Dialog onOpenChange={setShowUpdateDialog} open={showUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Deletion Date</DialogTitle>
            <DialogDescription>
              Set a new deletion date for {selectedRows.length} selected
              file(s).
            </DialogDescription>
          </DialogHeader>
          <div>
            <DatePicker onDateChange={setDate} value={date} />
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowUpdateDialog(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={!date} onClick={handleBulkUpdateDeletionDate}>
              Update {selectedRows.length} file(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteDate;
