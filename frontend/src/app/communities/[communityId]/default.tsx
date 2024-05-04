import { redirect } from 'next/navigation';

export default function Default({
  params,
}: {
  params: {
    communityId: string;
  }
}) {
  // On page refresh when the modal is open, we simply redirect to the threads
  // page, which automatically closes the modal.
  redirect(`/communities/${params.communityId}/threads`);
}
