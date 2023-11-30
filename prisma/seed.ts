import prisma from '../lib/prisma'
import axios from 'axios';
import fs from 'fs'
import { openai } from '../lib/openai'
import path from 'path'
// import pokemon from './pokemon-with-embeddings.json'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('process.env.OPENAI_API_KEY is not defined. Please set it.')
}

async function main() {
  try {
    const pika = await prisma.pokemon.findFirst({
      where: {
        name: 'pikachu',
      },
    })

    if (pika) {
      console.log('Pokédex already seeded!')
      return
    }

  } catch (error) {
    console.error('Error checking if "Pikachu" exists in the database.')
    throw error
  }

  const pokemon: any = await fetchPokemon()
  const data = [];

  for (const record of (pokemon as any)) {
    // In order to save time, we'll just use the embeddings we've already generated
    // for each Pokémon. If you want to generate them yourself, uncomment the
    // following line and comment out the line after it.

    const embeddingText = `
      name: ${record.name}
      description: ${record.description}
      color: ${record.color}
      abilities: ${record.abilities}
      type: ${record.type}
      ${record.habitat ? `habitat: ${record.habitat}` : ''}
      ${record.genus ? `body shape: ${record.shape}` : ''}
      ${record.genus ? `genus: ${record.genus}` : ''}
      ${record.isLegendary ? 'is a legendary pokemon' : ''},
    `;

    const embedding = await generateEmbedding(embeddingText);
    const pokeRecord = {
      ...record,
      embedding
    }
    
    // Create the pokemon in the database
    const pokemon = await prisma.pokemon.create({
      data: record,
    })

    // Add the embedding
    await prisma.$executeRaw`
        UPDATE pokemon
        SET embedding = ${embedding}::vector
        WHERE id = ${pokemon.id}
    `

    console.log(`Added ${pokemon.number} ${pokemon.name}`)
    data.push(pokeRecord)
  }

  // Uncomment the following lines if you want to generate the JSON file
  fs.writeFileSync(
    path.join(__dirname, "./pokemon-with-embeddings.json"),
    JSON.stringify({ data }, null, 2),
  );

  console.log('Pokédex seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

async function generateEmbedding(_input: string) {
  const input = _input.replace(/\n/g, ' ')
  const embeddingData = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input,
  })

  const [{ embedding }] = (embeddingData as any).data

  return embedding
}

async function fetchPokemon() {
  const promises = [];
  const numberOfPokemon = 1017;
  //const numberOfPokemon = 10;

  for (let i = 1; i <= numberOfPokemon; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    const description = `https://pokeapi.co/api/v2/pokemon-species/${i}`

    const pokemonData: any = Promise.all([
      axios.get(url).then((res) => res.data).catch(() => null),
      axios.get(description).then((res) => res.data).catch(() => null)
    ]).then((results) => {
      const pokemon = results[0];
      const description = results[1];

      if(!(pokemon && description)) {
        return null;
      }

      const descriptions = (description.flavor_text_entries.filter((entry: { language: { name: string; }; }) => entry.language.name === 'en')) || [];
      const descriptionText = descriptions.reduce((acc: any, entry: { flavor_text: string; }) => {
        if(entry.flavor_text.length > acc.length) {
          return entry.flavor_text;
        }

        return acc;
      }, '');

      const color = description.color.name;
      const shape = description.shape?.name || '';
      const isLegendary = description.is_legendary || false;
      const habitat = description.habitat?.name || '';
      const genus = description.genera.find((entry: { language: { name: string; }; }) => entry.language.name === 'en')?.genus || '';

      return {
        ...pokemon,
        description: descriptionText.replaceAll('pokemon', pokemon.name).replaceAll('Pokémon', pokemon.name).replaceAll('POKéMON', pokemon.name).replaceAll('Pokémon', pokemon.name).trim(),
        color,
        shape,
        isLegendary,
        habitat,
        genus: genus.replaceAll('pokemon', '').replaceAll('Pokémon', '').replaceAll('POKéMON', '').replaceAll('Pokémon', '').trim(),
      }
    });

    promises.push(pokemonData);
  }

  return Promise.all(promises).then((results) => {
      const pokemon = results.filter(Boolean).map((result) => ({
          name: result.name,
          number: result.order,
          image: result.sprites['front_default'],
          type: result.types.map((type: { type: { name: any } }) => type.type.name).join(', '),
          description: result.description.replace(/[\n\f\r]/g, ' ').replace(/\s+/g, ' ').trim(),
          color: result.color,
          abilities: result.abilities.map((ability: { ability: { name: any } }) => ability.ability.name).join(', '),
          height: result.height,
          weight: result.weight,
          total: result.stats.reduce((acc: any, stat: { base_stat: any }) => acc + stat.base_stat, 0),
          hp: result.stats.find((stat: { stat: { name: any } }) => stat.stat.name === 'hp').base_stat,
          attack: result.stats.find((stat: { stat: { name: any } }) => stat.stat.name === 'attack').base_stat,
          defense: result.stats.find((stat: { stat: { name: any } }) => stat.stat.name === 'defense').base_stat,
          spAtk: result.stats.find((stat: { stat: { name: any } }) => stat.stat.name === 'special-attack').base_stat,
          spDef: result.stats.find((stat: { stat: { name: any } }) => stat.stat.name === 'special-defense').base_stat,
          speed: result.stats.find((stat: { stat: { name: any } }) => stat.stat.name === 'speed').base_stat,
          shape: result.shape,
          isLegendary: result.isLegendary,
          habitat: result.habitat,
          genus: result.genus,
      }));

      return pokemon;
  });
}
