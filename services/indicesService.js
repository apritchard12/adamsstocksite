import { unstable_cache } from 'next/cache';
import { fetchIndicesRaw } from './indicesFetcher';

// Wrapped in unstable_cache for Next.js Data Cache
export const getMarketIndices = unstable_cache(
  async () => {
    return await fetchIndicesRaw();
  },
  ['market-indices'], // Cache Key
  { revalidate: 180 } // 180 seconds = 3 minutes
);

