import Link from 'next/link';
import thumbnailImg from '../../assets/minecraft.jpg';
import threadIcon from '../../assets/discussion-icon.svg';
import Image from 'next/image';
import { saira } from '@/fonts';

const CommunityCard = ({
  communityId,
  name,
  numThreads,
  categories,
}: {
  communityId: string;
  name: string;
  numThreads: string;
  categories: string[];

}) => {
  return (
    <li className='group bg-interex-comm-card shadow-comm-card w-full max-w-[200px] transition-[transform,_shadow] duration-300 hover:shadow-comm-card-hover hover:scale-[1.02]'>
      <Link href={`/communities/${communityId}/threads`}>
        <Image className='flex h-52 object-cover' src={thumbnailImg} alt={`${name} Thumbnail`} />
        
        <div className='my-2 mx-3'>
          {/* Community Name */}
          <h3 className={`${saira.className} font-semibold text-xl mb-2 group-hover:underline group-hover:text-interex-blue`}>{name}</h3>

          {/* Thread Count */}
          <div className='flex gap-2 items-center mb-2'>
            <Image className='w-6' src={threadIcon} alt='Thread Icon' />
            <p className='text-sm'>{numThreads} Threads</p>
          </div>

          {/* Categories */}
          <ul className='flex flex-wrap gap-2'>
            {categories.map((category, idx) => {
              return (
                <li
                  key={idx}
                  className='text-sm bg-[#276A7F] rounded-lg px-3'
                >
                  {category}
                </li>
              )
            })}
          </ul>
        </div>
      </Link>
    </li>
  )
}

export default CommunityCard;
