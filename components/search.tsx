'use client';

import { Command, CommandInput } from '@/components/command';
import { type Pokemon } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

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
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 justify-items-center'>
				{searchResults.map((pokemon) => (
					<div key={pokemon.name} className='max-w-xs rounded overflow-hidden shadow-lg bg-white'>
						<img className='w-11/12' src={pokemon.image} alt={`${pokemon.name} Image`} />
						<div className='px-6 py-4'>
							<div className='font-bold text-xl mb-1'>{pokemon.name} <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 ml-2'>
                {pokemon.similarity?.toFixed(3)}
							</span></div>
							<p className='text-gray-700 text-base mb-1'>{pokemon.description}</p>
							<p className='text-gray-700 text-base'><span className="font-bold">Type:</span> {pokemon.type}</p>
							<p className='text-gray-700 text-base'><span className="font-bold">Abilities:</span> {pokemon.abilities.split(',').toString()}</p>
							{pokemon.habitat && (<p className='text-gray-700 text-base'><span className="font-bold">Habitat:</span> {pokemon.habitat}</p>)}
							{pokemon.genus && (<p className='text-gray-700 text-base'><span className="font-bold">Genus:</span> {pokemon.genus}</p>)}
							{pokemon.shape && (<p className='text-gray-700 text-base'><span className="font-bold">Shape:</span> {pokemon.shape}</p>)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

Search.displayName = 'Search';
