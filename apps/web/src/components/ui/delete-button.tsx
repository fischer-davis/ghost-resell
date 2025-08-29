import { useMutation } from '@tanstack/react-query';
import type { Table } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { File } from '@/components/file-columns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@/utils/trpc';

interface DeleteButtonProps<TData> {
  table: Table<TData>;
}

export const DeleteButton = <TData,>({ table }: DeleteButtonProps<TData>) => {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const trpc = useTRPC();

  // const queryKey = trpc.file.getUploadedFiles.queryKey();

  const deleteMutation = trpc.file.deleteFiles.mutationOptions({
    onSuccess: () => {
      toast.success('Files deleted successfully');
      table.resetRowSelection();
      // trpc.file.getUploadedFiles.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteFiles = useMutation(deleteMutation);

  const handleDelete = () => {
    const idsToDelete = selectedRows.map((row) => (row.original as File).id);
    deleteFiles.mutate(idsToDelete);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={!selectedRows.length}>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            selected files.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
