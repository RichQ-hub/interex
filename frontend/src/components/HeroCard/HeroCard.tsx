import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { saira } from '@/fonts';

const HeroCard = ({
  title,
  content,
  link,
  bgColor,
  textColor,
  bgImg,
}: {
  title: string;
  content: string;
  link: string;
  bgColor: string;
  textColor: string;
  bgImg: any;
}) => {
  return (
    <div
      className='group relative flex items-end overflow-hidden max-w-[260px] w-full h-96 border-[1px] border-[#e3e3e3c4] hover:translate-x-2 hover:-translate-y-2 duration-200 hover:shadow-hero-card-hover'
      style={{ backgroundColor: bgColor }}
    >
      <Image
        className='absolute top-0 left-0 right-0 h-[80%] z-0'
        src={bgImg}
        alt='hero-icon'
      />

      <div className='relative p-4 z-10 w-full bg-[#02121de6] translate-y-[calc(100%-64px)] group-hover:translate-y-0 duration-500 group-hover:delay-500'>
        {/* Title */}
        <h2
          className={
            `${saira.className} mb-2 pb-2 relative font-semibold text-2xl after:absolute after:w-[calc(100%+16px)]
            after:h-1 after:left-[calc(16px*-1)] after:bottom-0 after:bg-white after:scale-x-0 group-hover:after:scale-x-100
            after:origin-left after:duration-500`
          }
          style={{ color: textColor }}
        >
          {title}
        </h2>

        {/* Content */}
        <p className='text-sm opacity-0 group-hover:opacity-100 transition-opacity group-hover:delay-1000'>{content}</p>

        {/* Button */}
        <Link className='block w-max text-black mt-2 opacity-0 group-hover:opacity-100 transition-opacity group-hover:delay-1000 px-4 py-1 rounded-md font-semibold text-sm' style={{ backgroundColor: textColor }} href={link}>Discover</Link>
      </div>
    </div>
  )
}

export default HeroCard;
