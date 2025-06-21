import { nova, saira } from '@/fonts';
import heroImg from '@/assets/hero-img.svg';
import collabImg from '@/assets/collaborate.svg';
import commIcon from '@/assets/community-icon.svg';
import teamIcon from '@/assets/team-icon.svg';
import Image from 'next/image';
import Link from 'next/link';
import divider from '@/assets/divider-jewel.png';
import HeroCard from '@/components/HeroCard';
import teamChecklistImg from '@/assets/team-checklist.svg';
import groupDiscImg from '@/assets/group-discussion.svg';
import profilingImg from '@/assets/profiling.svg';

export default function HomePage() {
  return (
    <main className='mt-14 py-8'>
      {/* Hero Section */}
      <section className='flex items-center justify-center mb-8 px-4'>
        <div className='mr-4 max-w-sm'>
          <h1 className={`${nova.className} text-interex-brand text-5xl mb-4`}>interex</h1>
          <p className='text-xl mb-6'>Where social networking meets simplicity and innovation!</p>
          <Link
            href='/communities'
            className='flex items-center gap-2 w-min py-2 px-4 font-semibold border-interex-blue border-2 text-interex-blue text-lg'
          >
            Discover
            <svg className='w-4 fill-interex-blue' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
          </Link>
        </div>
        <Image
          src={heroImg}
          className='h-[600px]'
          alt='hero-img'
        />
      </section>
      
      {/* Divider */}
      <Image 
        src={divider}
        className='w-full'
        alt='divider'
      />

      {/* About Section */}
      <section className='my-8 px-4'>
        <h2 className={`${saira.className} font-bold text-interex-blue text-4xl mx-auto text-center`}>What we offer</h2>
        <div className='flex items-center justify-center'>
          <Image
            className='w-[600px]'
            src={collabImg}
            alt='collab-image'
          />
          <div>
            <div className='grid grid-cols-[60px,1fr] grid-rows-[min-content,1fr] border-b-[1px] border-white py-8'>
              <h3 className={`col-start-2 col-end-3 row-start-1 row-end-2 ${saira.className} font-semibold text-2xl self-center`}>Communities</h3>
              <Image className='w-12 col-start-1 col-end-2 row-start-1 row-end-2' src={commIcon} alt='community-icon'/>
              <p className='col-start-2 col-end-3 row-start-2 row-end-3'>Reinvigorate your passion by connecting with others who share the same interests as you!</p>
            </div>
            <div className='grid grid-cols-[60px,1fr] grid-rows-[min-content,1fr] py-8'>
              <h3 className={`col-start-2 col-end-3 row-start-1 row-end-2 ${saira.className} font-semibold text-2xl self-center`}>Teams</h3>
              <Image className='w-12 col-start-1 col-end-2 row-start-1 row-end-2' src={teamIcon} alt='community-icon'/>
              <p className='col-start-2 col-end-3 row-start-2 row-end-3'>Streamline collaboration, enhance communication, and boost productivity with our intuitive team management app!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <Image 
        src={divider}
        className='w-full'
        alt='divider'
      />

      {/* Hero Links Section */}
      <section className='my-8 px-4'>
        <h2 className={`${saira.className} font-bold text-interex-blue text-4xl mx-auto text-center mb-6`}>Explore</h2>
        {/* Hero Links */}
        <ul className='flex items-center justify-evenly gap-8'>
          <HeroCard
            title='Teams'
            content='Join a collaborative framework that millions of users partake. Have access to team management tools, planners, and more!'
            link='/teams'
            bgColor='#66BF47'
            textColor='#92D58C'
            bgImg={teamChecklistImg}
          />
          <HeroCard
            title='Community'
            content='Discover endless communities with thousands of discussions, or even share some of your own!'
            link='/communities'
            bgColor='#6BBAF3'
            textColor='#52ACE2'
            bgImg={groupDiscImg}
          />
          <HeroCard
            title='Profile'
            content='Customise your own profile!'
            link='/profile'
            bgColor='#CE79E3'
            textColor='#ab3ac7'
            bgImg={profilingImg}
          />
        </ul>
      </section>
    </main>
  )
}
