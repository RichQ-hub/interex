'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const SearchBar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [query, setQuery] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);

    params.set('page', '1');

    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <form className='w-full flex justify-center' onSubmit={handleSubmit}>
      <input
        className='w-3/4 h-12 px-6 bg-[#051A33EB] shadow-comm-searchbar text-zinc-300'
        type='text'
        name=''
        id=''
        placeholder='Search for Communities...'
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  )
}

export default SearchBar