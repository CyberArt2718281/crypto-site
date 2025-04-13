export interface Cryptocurrency {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
}
export interface ICryptoInfo {
    order_in_query: number;
    name: string;
    image: string | null;
    current_price: number | null;
    price_change_24h: number | null;
    market_cap: number | null;
    last_updated: string | null;
    low_24h: number | null;
    high_24h: number | null;
}

export interface Message {
    text: string;
    sender: 'user' | 'other';
}