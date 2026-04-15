import React from 'react';
import { Edit2, Trash2, Copy, Calendar } from 'lucide-react';
import type { Voucher } from '../types/voucher';
import '../styles/VoucherCard.css';

interface VoucherCardProps {
  voucher: Voucher;
  onDelete: (id: string) => void;
  onCopy: (code: string) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

export const VoucherCard: React.FC<VoucherCardProps> = ({ voucher, onDelete, onCopy }) => {
  const { id, code, discountType, value, minOrder, maxDiscount, startDate, endDate, usageLimit, usedCount, status } = voucher;

  const isInactive = status === 'inactive';
  const pct = Math.min(100, Math.round((usedCount / usageLimit) * 100));

  const headerModifier = discountType === 'freeship' ? 'freeship' : discountType === 'percent' ? 'percent' : 'fixed';

  const progressModifier = pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : '';

  const displayValue =
    discountType === 'percent' ? `${value}%` : formatCurrency(value);

  const badgeLabel =
    discountType === 'freeship' ? 'Freeship' :
    discountType === 'percent' ? `Giảm giá ${value}%` :
    `Giảm ${formatCurrency(value)}`;

  return (
    <div className={`voucher-card ${isInactive ? 'voucher-card--inactive' : ''}`}>
      {/* Inactive Overlay */}
      {isInactive && (
        <div className="voucher-card__overlay">
          <span className="voucher-card__overlay-label">Không hoạt động</span>
        </div>
      )}

      {/* Header */}
      <div className={`voucher-card__header voucher-card__header--${headerModifier}`}>
        <div className="voucher-card__title-area">
          <div className="voucher-card__badge">{badgeLabel}</div>
          <div className="voucher-card__value">
            {displayValue}
            {discountType === 'percent' && <span className="voucher-card__unit"> giảm giá</span>}
          </div>
          {(discountType === 'percent' || discountType === 'fixed') && (
            <div className="voucher-card__min-order">
              Đơn tối thiểu: {formatCurrency(minOrder)}
              {maxDiscount && ` · Tối đa ${formatCurrency(maxDiscount)}`}
            </div>
          )}
          {discountType === 'freeship' && (
            <div className="voucher-card__min-order">
              Đơn tối thiểu: {formatCurrency(minOrder)}
            </div>
          )}
        </div>
        <div className="voucher-card__actions">
          <button
            className="voucher-card__action-btn"
            title="Sửa"
          >
            <Edit2 size={14} />
          </button>
          <button
            className="voucher-card__action-btn"
            title="Sao chép mã"
            onClick={() => onCopy(code)}
          >
            <Copy size={14} />
          </button>
          <button
            className="voucher-card__action-btn voucher-card__action-btn--danger"
            title="Xóa"
            onClick={() => onDelete(id)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Ticket Notch separator */}
      <div className="voucher-card__notch">
        <div className="voucher-card__notch-line" />
      </div>

      {/* Code Row */}
      <div className="voucher-card__code-row">
        <span className="voucher-card__code-label">Mã:</span>
        <span className="voucher-card__code">{code}</span>
      </div>

      {/* Body */}
      <div className="voucher-card__body">
        {/* Progress bar */}
        <div>
          <div className="voucher-card__progress-header">
            <span className="voucher-card__progress-text">
              Đã dùng: {usedCount}/{usageLimit}
            </span>
            <span className="voucher-card__progress-pct">{pct}%</span>
          </div>
          <div className="voucher-card__progress-track">
            <div
              className={`voucher-card__progress-fill ${progressModifier ? `voucher-card__progress-fill--${progressModifier}` : ''}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Date */}
        <div className="voucher-card__date">
          <Calendar className="voucher-card__date-icon" size={13} />
          <span>
            {startDate} – {endDate}
          </span>
        </div>
      </div>
    </div>
  );
};
