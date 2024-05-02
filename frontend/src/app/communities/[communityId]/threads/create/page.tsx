import CreateThreadForm from '@/components/CreateThreadForm';
import CommunityService from '@/services/CommunityService';

export default async function CreateThreadPage({
  params,
}: {
  params: {
    communityId: string;
  }
}) {
  const communityFlairs = await CommunityService.getAllFlairs(params.communityId);
  return (
    <section className='bg-interex-bg-thread py-6 px-8'>
      <CreateThreadForm communityFlairs={communityFlairs} />
    </section>
  )
}