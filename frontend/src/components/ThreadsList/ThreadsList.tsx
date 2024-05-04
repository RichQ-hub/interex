import React from 'react';
import ThreadService from '@/services/ThreadService';
import ThreadCard from '../ThreadCard';
// import { threads } from '@/data/threads';

const ThreadsList = async ({
  communityId,
}: {
  communityId: string;
}) => {
  const threads = await ThreadService.getAllThreads(communityId);
  return (
    <ul>
      {threads.map((thread) => {
        return (
          <ThreadCard
            key={thread.id}
            details={thread}
          />
        )
      })}
    </ul>
  )
}

export default ThreadsList;
