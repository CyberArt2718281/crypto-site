import axios from 'axios';

export interface ICryptoInfo {
  id: string;
  order_in_query: number;
  name: string;
  image: string;
  current_price: number | null;
  price_change_24h: number | null;
  high_24h: number | null;
  low_24h: number | null;
  market_cap: number | null;
  last_updated: string;
}

export async function getRates(page: number, perPage: number, order: 'asc' | 'desc') {
  console.log(`Requesting page ${page} with per page ${perPage} with ${order} order`);
  const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_${order}&per_page=${perPage}&page=${page}`);
  const data = response.data.map((each: unknown[], i: number) => {
    return {...each, order_in_query: (page - 1) * perPage + i + 1}
  }) as ICryptoInfo[];
  return data;
}
