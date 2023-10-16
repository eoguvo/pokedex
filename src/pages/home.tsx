import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { LayoutGroup, motion } from 'framer-motion';
import useSWR from 'swr'

import { colors } from '../utils/colors';

type ISprites = { front_default: string, other: { "official-artwork": { front_default: string } } }

interface IPokemon {
  id: number,
  name: string,
  types: { type: { name: string } }[],
  sprites: ISprites
}

const getSprite = (sprites: ISprites) => sprites.other['official-artwork'].front_default || sprites.front_default;

const fetcher = (args: string) => fetch(args).then(res => res.json())

export default function Home() {
  const { data } = useSWR('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0', fetcher)
  const [pokemons, setPokemons] = useState([] as IPokemon[]);

  useEffect(() => {
    async function fetchPokemons() {
      if(!data) return;
      const map = data.results.map(({name}) => fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => (res.json()) as Promise<IPokemon>));
      const fullfiledPokemons = await Promise.all<IPokemon[]>(map);
      const sortedPokemons = fullfiledPokemons.sort((a, b) => a.id - b.id);
      setPokemons(sortedPokemons);
    }
    fetchPokemons()
  }, [data])

  const [searchText, setSearchText] = useState('');

  const finalData = searchText.length > 0 ? pokemons.filter(pokemon => pokemon.name.toUpperCase().includes(searchText.toUpperCase()) || pokemon.id === Number(searchText)) : pokemons;

  return (
    <div className="text-center p-8">
      <h1 className="text-6xl font-bold text-red-600">
        Pokedex
      </h1>

      <label htmlFor="search" className='fixed items-center flex justify-between mx-auto cursor-text w-[300px] my-6 text-white border bg-[#222] border-[#D9D9D9] rounded-full text-left hover:border-red-500 hover:text-red-500 transition-all left-0 right-0 z-20'>

        <input name='search' id='search' placeholder='Pikachu...' onChange={e => setSearchText(e.target.value)} value={searchText} className='text-white p-4 py-3' />

        <FiSearch className='cursor-pointer p-4 w-12 h-12' />

      </label>

      <span className='my-12 flex' />

      <LayoutGroup>
        
        <ul className="flex justify-center flex-wrap max-w-7xl mx-auto gap-6">
          {!!finalData && !!finalData.length && finalData.map(({ name, types, sprites, id }) => (

            <NavLink to={name} key={id}>

              <motion.div layoutRoot layout layoutId={`${name}-bg`} className="hover:-translate-y-1 hover:shadow-2xl shadow-none transition duration-500 ease-in-out transform w-56 py-6 px-4 rounded-md cursor-pointer" style={{ backgroundColor: colors[types[0].type.name] }}>

                <motion.img layoutId={name} src={getSprite(sprites)} className='w-full z-10' alt={name} />

                <motion.h1 layoutId={`${name}-name`} className="first-letter:uppercase text-black text-[24px] font-bold mb-4">{name}</motion.h1>

                <div className="flex gap-2 w-full justify-center">
                  {types.map(({ type }) =>
                    <p key={`${type.name}-${id}`} style={{ backgroundColor: colors[type.name] }} className={`border border-[#d9d9d9] text-white hover:opacity-80 transition-all rounded-[5px] px-2 py-1`}>{type.name}</p>
                  )}
                </div>

              </motion.div>

            </NavLink>

          ))}

        </ul>

      </LayoutGroup>

    </div>
  );
}