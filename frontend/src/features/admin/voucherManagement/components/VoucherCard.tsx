import React, { useMemo, useCallback } from 'react';
import { Edit2, Trash2, Copy, Calendar } from 'lucide-react';
import type { Voucher } from '../types/voucher';
import '../styles/VoucherCard.css';

interface VoucherCardProps {
  voucher: Voucher;
  onDelete: (id: string) => void;
  onCopy: (code: string) => void;
  onEdit?: (voucher: Voucher) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

export const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  onDelete,
  onCopy,
  onEdit,
}) => {
  const {
    id,
    code,
    discountType,
    value,
    minOrder,
    maxDiscount,
    startDate,
    endDate,
    usageLimit,
    usedCount,
    status,
  } = voucher;

  const isInactive = status === 'inactive';

  // ================= SAFE PERCENT =================
  const pct = useMemo(() => {
    if (!usageLimit) return 0;
    return Math.min(100, Math.round((usedCount / usageLimit) * 100));
  }, [usedCount, usageLimit]);

  // ================= STYLE MODIFIER =================
  const headerModifier =
    discountType === 'freeship'
      ? 'freeship'
      : discountType === 'percent'
      ? 'percent'
      : 'fixed';

  const progressModifier =
    pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : '';

  // ================= DISPLAY VALUE =================
  const displayValue =
    discountType === 'percent'
      ? `${value}%`
      : formatCurrency(value);

  const badgeLabel =
    discountType === 'freeship'
      ? 'Freeship'
      : discountType === 'percent'
      ? `Giảm ${value}%`
      : `Giảm ${formatCurrency(value)}`;

  // ================= CALLBACKS =================
  const handleCopy = useCallback(() => {
    onCopy(code);
  }, [code, onCopy]);

  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  const handleEdit = useCallback(() => {
    onEdit?.(voucher);
  }, [onEdit, voucher]);

  return (
    <div
      className={`voucher-card ${
        isInactive ? 'voucher-card--inactive' : ''
      }`}
    >
      {/* OVERLAY */}
      {isInactive && (
        <div className="voucher-card__overlay">
          <span className="voucher-card__overlay-label">
            Không hoạt động
          </span>
        </div>
      )}

      {/* HEADER */}
      <div
        className={`voucher-card__header voucher-card__header--${headerModifier}`}
      >
        <div className="voucher-card__title-area">
          <div className="voucher-card__badge">
            {badgeLabel}
          </div>

          <div className="voucher-card__value">
            {displayValue}
          </div>

          <div className="voucher-card__min-order">
            Đơn tối thiểu: {formatCurrency(minOrder)}
            {maxDiscount &&
              discountType === 'percent' && (
                <> · Tối đa {formatCurrency(maxDiscount)}</>
              )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="voucher-card__actions">
          <button
            className="voucher-card__action-btn"
            title="Sửa"
            onClick={handleEdit}
          >
            <Edit2 size={14} />
          </button>

          <button
            className="voucher-card__action-btn"
            title="Sao chép mã"
            onClick={handleCopy}
          >
            <Copy size={14} />
          </button>

          <button
            className="voucher-card__action-btn voucher-card__action-btn--danger"
            title="Xóa"
            onClick={handleDelete}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* NOTCH */}
      <div className="voucher-card__notch">
        <div className="voucher-card__notch-line" />
      </div>

      {/* CODE */}
      <div className="voucher-card__code-row">
        <span className="voucher-card__code-label">Mã:</span>
        <span className="voucher-card__code">{code}</span>
      </div>

      {/* BODY */}
      <div className="voucher-card__body">
        {/* PROGRESS */}
        <div>
          <div className="voucher-card__progress-header">
            <span className="voucher-card__progress-text">
              Đã dùng: {usedCount}/{usageLimit}
            </span>
            <span className="voucher-card__progress-pct">
              {pct}%
            </span>
          </div>

          <div className="voucher-card__progress-track">
            <div
              className={`voucher-card__progress-fill ${
                progressModifier
                  ? `voucher-card__progress-fill--${progressModifier}`
                  : ''
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* DATE */}
        <div className="voucher-card__date">
          <Calendar size={13} />
          <span>
            {startDate} – {endDate}
          </span>
        </div>
      </div>
    </div>
  );
};