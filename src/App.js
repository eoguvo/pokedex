import { useEffect, useState } from 'react';
import useSWR from 'swr'
import { colors } from './utils/colors';
import './App.css';
import { throttle } from 'radash';

const fetcher = (...args) => fetch(...args).then(res => res.json())

function App() {
  const { data } = useSWR('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0', fetcher)
  const [pokemons, setPokemons] = useState([]);

  const InputChange = () => {
  }

  useEffect(() => {
    async function fetchPokemons() {
      if(!data) return;
      console.log(data);
      const p = [];
      const map = data.results.map(({name}) => fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json()).then(res => {
        p.push(res);
        return p;
      }));
      const fullfiledPokemons = await Promise.all(map);
      const sortedPokemons = fullfiledPokemons.sort((a, b) => a.id - b.id);
      setPokemons(...sortedPokemons);
    }
    fetchPokemons()
  }, [data])

  return (
    <div className="text-center p-8">
      <h1 className="text-6xl font-bold text-red-600">
        Pokedex
      </h1>
        <ul className="flex justify-center flex-wrap mt-10 max-w-7xl mx-auto gap-6">
          {!!pokemons && !!pokemons.length && pokemons.map(({ name, types, sprites, id }) => <li key={id} className="hover:-translate-y-1 hover:shadow-2xl shadow-none transition duration-500 ease-in-out transform w-56 p-8 rounded cursor-pointer" style={{ backgroundColor: colors[types[0].type.name] }}>
          <img src={sprites.front_default} className='w-full' alt={name} />
          <h1 className="text-black text-size-8 font-bold">{name}</h1>
          <p className="type">{types.map(({type}) => type.name).join(" | ")}</p>
        </li>)}
        </ul>
    </div>
  );
}

export default App;