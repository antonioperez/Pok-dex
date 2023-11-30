import { searchPokedex } from '@/app/actions'
import { Search } from '@/components/search'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Pokédex
      </h1>
      <div className="">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 leading-5">
              Try searching via natural language.. Try &quot;who's electric?&quot; or &quot;fire&quot; or &quot;lizard&quot;
              or &quot;Who's strongest?&quot; Cosine similarity is used to find the most
              similar Pokémon.
            </p>
          </div>
        </div>
        <div className="divide-y divide-gray-900/5">
          <Search searchPokedex={searchPokedex} />
        </div>
      </div>
      <div className="mt-12 w-full flex items-center justify-between px-6 ">
        <Link
          href="https://vercel.com"
          className="block lg:absolute bottom-12 left-12"
        >
          <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            width={100}
            height={24}
            priority
          />
        </Link>
        <Link
          href="https://github.com/antonioperez/Pokedex"
          className="lg:absolute bottom-12 right-12 flex items-center space-x-2"
        >
          <Image
            src="/github.svg"
            alt="GitHub Logo"
            width={24}
            height={24}
            priority
          />
          <span className="font-light">Source</span>
        </Link>
      </div>
    </main>
  )
}
