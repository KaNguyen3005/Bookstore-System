import React from 'react';
import {
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  DollarSign,
} from 'lucide-react';

import '../styles/OrderStats.css';

interface OrderStatsProps {
  stats: {
    totalOrders: number;
    pendingCount: number;
    shippingCount: number;
    deliveredCount: number;
    cancelledCount: number;
    totalRevenue: number;
  };
}

export const OrderStats: React.FC<
  OrderStatsProps
> = ({ stats }) => {
  // ================= FORMAT MONEY =================
  const formatCurrency = (
    amount: number
  ) => {
    return new Intl.NumberFormat(
      'vi-VN',
      {
        style: 'currency',
        currency: 'VND',
      }
    )
      .format(amount)
      .replace('₫', 'đ');
  };

  // ================= STATS CARD DATA =================
  const statCards: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    modifier: string;
    iconModifier: string;
    isLargeText?: boolean;
  }[] = [
    {
      title: 'Tổng đơn',
      value: stats.totalOrders,

      icon: (
        <ShoppingBag
          className="icon"
          size={20}
        />
      ),

      modifier: 'teal',
      iconModifier: '',
    },

    {
      title: 'Chờ xác nhận',
      value: stats.pendingCount,

      icon: (
        <Clock
          className="icon"
          size={20}
          style={{
            color: '#fb923c',
          }}
        />
      ),

      modifier: '',
      iconModifier: 'pending',
    },

    {
      title: 'Đang giao',
      value: stats.shippingCount,

      icon: (
        <Truck
          className="icon"
          size={20}
          style={{
            color: '#60a5fa',
          }}
        />
      ),

      modifier: '',
      iconModifier: 'shipping',
    },

    {
      title: 'Đã giao',
      value: stats.deliveredCount,

      icon: (
        <CheckCircle
          className="icon"
          size={20}
          style={{
            color: '#22c55e',
          }}
        />
      ),

      modifier: '',
      iconModifier: 'delivered',
    },

    {
      title: 'Đã hủy',
      value: stats.cancelledCount,

      icon: (
        <XCircle
          className="icon"
          size={20}
          style={{
            color: '#ef4444',
          }}
        />
      ),

      modifier: '',
      iconModifier: 'cancelled',
    },

    {
      title: 'Doanh thu',

      value: formatCurrency(
        stats.totalRevenue
      ),

      icon: (
        <DollarSign
          className="icon"
          size={20}
        />
      ),

      modifier: 'green',
      iconModifier: '',
      isLargeText: true,
    },
  ];

  return (
    <div className="order-stats">
      {statCards.map((card, idx) => (
        <div
          key={idx}
          className={`order-stats__card ${
            card.modifier
              ? `order-stats__card--${card.modifier}`
              : ''
          }`}
        >
          {/* ICON */}
          <div
            className={`order-stats__icon-wrapper ${
              card.iconModifier
                ? `order-stats__icon-wrapper--${card.iconModifier}`
                : ''
            }`}
          >
            {card.icon}
          </div>

          {/* INFO */}
          <div className="order-stats__info">
            <div
              className={`order-stats__value ${
                card.isLargeText
                  ? 'order-stats__value--large'
                  : ''
              }`}
            >
              {card.value}
            </div>

            <div className="order-stats__label">
              {card.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};