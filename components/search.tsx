'use client';

import { Command, CommandInput } from '@/components/command';
import { type Pokemon } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import Image from 'next/image'

export interface SearchProps {
	searchPokedex: (content: string) => Promise<Array<Pokemon & { similarity: number }>>;
}

export function Search({ searchPokedex }: SearchProps) {
	const [query, setQuery] = useState('');
	const [searchResults, setSearchResults] = useState<Array<Pokemon & { similarity?: number }>>([]);

	const [debouncedQuery] = useDebounce(query, 150);

	useEffect(() => {
		let current = true;

		if (debouncedQuery.trim().length > 0) {
			searchPokedex(debouncedQuery).then((results) => {
				if (current) {
					setSearchResults(results);
				}
			});
		}

		return () => {
			current = false;
		};
	}, [debouncedQuery, searchPokedex]);

	return (
		<div className='w-full'>
			<Command label='Command Menu' shouldFilter={false} className='mb-2'>
				<CommandInput
					id='search'
					placeholder='Search for Pokémon'
					className='focus:ring-0 sm:text-sm text-base focus:border-0 border-0 active:ring-0 active:border-0 ring-0 outline-0'
					value={query}
					onValueChange={(q) => setQuery(q)}
				/>
			</Command>
			<div className='grid grid-cols-4 gap-4'>
				{searchResults.map((pokemon) => (
					<div key={pokemon.name} className='max-w-xs rounded overflow-hidden shadow-lg bg-white'>
						<Image className='w-11/12' src={pokemon.image} alt='Pokemon Image' />
						<div className='px-6 py-4'>
							<div className='font-bold text-xl mb-1'>{pokemon.name}</div>
							<p className='text-gray-700 text-base mb-1'>{pokemon.description}</p>
							<p className='text-gray-700 text-base'><span className="font-bold">Type:</span> {pokemon.type}</p>
							<p className='text-gray-700 text-base'><span className="font-bold">Abilities:</span> {pokemon.abilities.split(',').toString()}</p>
						</div>
						<div className='px-6 pt-2 pb-2'>
							<span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
                {pokemon.similarity?.toFixed(3)}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

Search.displayName = 'Search';
