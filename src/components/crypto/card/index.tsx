import { ICryptoInfo } from '../utils';
import style from './CryptoCard.module.css';
import classnames from 'classnames';

// Добавляем проверку на null
function formatPriceChange(price: number | null) {
    if (price === null) return { symbol: '', className: '' };
    const rounded = Number(price.toFixed(3));
    if (rounded < 0) return { symbol: '↘️', className: style['price-down'] };
    if (rounded > 0) return { symbol: '↗️', className: style['price-up'] };
    return { symbol: '', className: '' };
}

function formatMarketCap(cap: number | null) {
    if (cap === null) return 'N/A';
    if (cap > 10 ** 12) return `${(cap / 10 ** 12).toFixed(2)}T`;
    if (cap > 10 ** 9) return `${(cap / 10 ** 9).toFixed(2)}B`;
    if (cap > 10 ** 6) return `${(cap / 10 ** 6).toFixed(2)}M`;
    return cap.toFixed(2);
}

function formatDate(dateString: string | null) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export default function CryptoCard(p: Readonly<ICryptoInfo>) {
    const priceChange = formatPriceChange(p.price_change_24h);

    return (
        <div className={classnames(style.card, p.order_in_query % 2 ? style.darker : style.lighter)}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <img src={p.image || ''} alt={`${p.name} logo`} />
                <h3>
                    {p.order_in_query}. {p.name}
                </h3>
            </div>

            <small>Updated: {formatDate(p.last_updated)}</small>

            <div className={style.details}>
                <span>
                    <b>Price:</b> ${p.current_price?.toFixed(2) ?? 'N/A'}
                </span>

                <span className={priceChange.className}>
                    <b>24h Change:</b> ${p.price_change_24h !== null ? Math.abs(p.price_change_24h).toFixed(2) : 'N/A'} {priceChange.symbol}
                </span>

                <span>
                    <b>Market Cap:</b> ${formatMarketCap(p.market_cap)}
                </span>

                <span>
                    <b>24h Range:</b> ${p.low_24h?.toFixed(2) ?? 'N/A'} - ${p.high_24h?.toFixed(2) ?? 'N/A'}
                </span>
            </div>
        </div>
    );
}