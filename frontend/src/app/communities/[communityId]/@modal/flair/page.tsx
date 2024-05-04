import CreateFlairModal from '@/components/CreateFlairModal';

export default async function FlairModal({
  params,
}: {
  params: {
    communityId: string;
  }
}) {
  return (
    <CreateFlairModal communityId={params.communityId}/>
  )
}