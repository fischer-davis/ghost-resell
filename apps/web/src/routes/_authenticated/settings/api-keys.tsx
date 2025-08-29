import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/settings/api-keys')({
  component: ApiKeys,
});

function ApiKeys() {
  return <div>Hello</div>;
}

export default ApiKeys;
