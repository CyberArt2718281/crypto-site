import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getRates } from './utils';
import CryptoCard from './card';
import style from './Crypto.module.css';

export default function Crypto() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(6);
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [cryptoName, setCryptoName] = useState('');

    const { data, isError, isLoading, error } = useQuery({
        queryKey: ['crypto', page, perPage, order],
        queryFn: () => getRates(page, perPage, order),
        refetchInterval: 60 * 1000,
        refetchOnWindowFocus: true,
    });

    if (isError) {
        return <div className={style.error}>Error loading prices: {error.message}</div>;
    }

    if (isLoading) {
        return <div className={style.loading}>Loading cryptocurrency data...</div>;
    }

    if (!data) {
        return <div className={style.error}>No data available</div>;
    }

    return (
        <div className={style.cryptoBlock}>
            <h2 style={{ color: 'white', marginBottom: '16px' }}>Cryptocurrency Market</h2>

            <div className={style.controls}>
                <div className={style.controlGroup}>
                    <span>Show:</span>
                    {[6, 12, 18].map((num) => (
                        <button
                            key={num}
                            className={perPage === num ? 'active' : ''}
                            onClick={() => setPerPage(num)}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                <div className={style.controlGroup}>
                    <span>Sort:</span>
                    <button
                        className={order === 'asc' ? 'active' : ''}
                        onClick={() => setOrder('asc')}
                    >
                        Ascending
                    </button>
                    <button
                        className={order === 'desc' ? 'active' : ''}
                        onClick={() => setOrder('desc')}
                    >
                        Descending
                    </button>
                </div>

                <input
                    placeholder='Filter by name...'
                    value={cryptoName}
                    onChange={(e) => setCryptoName(e.target.value)}
                />
            </div>

            <div className={style.grid}>
                {data
                    .filter(item =>
                        cryptoName === '' ||
                        item.name.toLowerCase().includes(cryptoName.toLowerCase())
                    )
                    .map((item) => (
                        <CryptoCard key={`crypto-${item.id}`} {...item} />
                    ))}
            </div>

            <div className={style.controls}>
                <div className={style.pagination}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span>Page {page}</span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={data.length < perPage}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}