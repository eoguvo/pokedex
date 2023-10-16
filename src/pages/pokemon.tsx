import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { colors } from '../utils/colors';
import useSWR from 'swr'

const fetcher = (args: string) => fetch(args).then(res => res.json());

interface IPokemon {
  id: number,
  name: string,
  types: { type: { name: string } }[],
  sprites: { front_default: string, other: { "official-artwork": { front_default: string } } }
}

export default function Pokemon() {
  const { pokemon: id } = useParams();

  const { data: pokemon } = useSWR(`https://pokeapi.co/api/v2/pokemon/${id}`, fetcher)

  const { pathname } = useLocation();

  const name = pathname.replace('/', '');

  const navigate = useNavigate();

  console.log(caches)

  const sprite = pokemon?.sprites.other['official-artwork'].front_default || pokemon?.sprites.front_default;

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto my-4">

      <FiArrowLeft className='z-20 w-[50px] text-red-500 h-full cursor-pointer' onClick={() => navigate(-1)} />

      <motion.div layoutId={`${name}-bg`} className='z-[-10] absolute h-[40vh] w-full left-0 top-0' style={{ backgroundColor: colors[pokemon?.types[0].type.name || ''] }} />

      <div className="flex flex-col w-full items-center">

        <motion.h1 layoutId={`${name}-name`} className="text-[64px] font-bold mb-4 first-letter:uppercase">{pokemon?.name}</motion.h1>

        <motion.img layoutId={name} src={sprite} className='max-w-[400px] w-1/2 h-full object-cover' alt={pokemon?.name} />

      </div>

    </div>
  );
}