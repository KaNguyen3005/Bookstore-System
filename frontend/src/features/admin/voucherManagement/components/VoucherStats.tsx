import React from 'react';
import { Ticket, Zap, TrendingUp, Clock } from 'lucide-react';
import type { VoucherStats as IVoucherStats } from '../types/voucher';
import '../styles/VoucherStats.css';

interface VoucherStatsProps {
  stats: IVoucherStats;
}

export const VoucherStats: React.FC<VoucherStatsProps> = ({ stats }) => {
  const cards = [
    {
      label: 'Tổng voucher',
      value: stats.total,
      icon: <Ticket size={22} />,
      modifier: 'teal',
    },
    {
      label: 'Đang hoạt động',
      value: stats.active,
      icon: <Zap size={22} />,
      modifier: 'green',
    },
    {
      label: 'Đã sử dụng',
      value: stats.used,
      icon: <TrendingUp size={22} />,
      modifier: 'orange',
    },
    {
      label: 'Sắp hết hạn',
      value: stats.expiringSoon,
      icon: <Clock size={22} />,
      modifier: 'red',
    },
  ];

  return (
    <div className="voucher-stats">
      {cards.map((card, idx) => (
        <div key={idx} className="voucher-stats__card">
          <div className={`voucher-stats__icon voucher-stats__icon--${card.modifier}`}>
            {card.icon}
          </div>
          <div className="voucher-stats__info">
            <span className="voucher-stats__value">{card.value}</span>
            <span className="voucher-stats__label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
