// import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
// import { useTRPC } from '@/utils/trpc';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  // const trpc = useTRPC();
  // const { data, isPending } = useQuery(
  //   trpc.file.getUploadedFiles.queryOptions()
  // );
  //
  // if (isPending) {
  //   return;
  // }

  return (
    <div>
      Index
    </div>
  );
}
