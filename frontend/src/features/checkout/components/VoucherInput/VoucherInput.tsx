import React from 'react';
import type { CheckoutVoucher } from '../../types';
import { FiTag, FiX } from 'react-icons/fi';
import './VoucherInput.css';

interface VoucherInputProps {
  code: string;
  appliedVoucher: CheckoutVoucher | null;
  error: string | null;
  success: string | null;
  isLoading: boolean;
  onChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
}

const VoucherInput: React.FC<VoucherInputProps> = ({
  code,
  appliedVoucher,
  error,
  success,
  isLoading,
  onChange,
  onApply,
  onRemove,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onApply();
  };

  return (
    <section className="voucher-input" aria-label="Mã giảm giá">
      <h2 className="voucher-input__title">
        <FiTag className="voucher-input__icon" />
        KaTiIa khuyến mãi
      </h2>

      {appliedVoucher ? (
        <div className="voucher-input__applied">
          <div className="voucher-input__applied-info">
            <FiTag />
            <span className="voucher-input__applied-code">{appliedVoucher.code}</span>
            <span className="voucher-input__applied-desc">
              Giảm {appliedVoucher.discount_value.toLocaleString('vi-VN')}đ
            </span>
          </div>
          <button
            id="btn-remove-voucher"
            className="voucher-input__remove-btn"
            onClick={onRemove}
            type="button"
            aria-label="Xóa mã giảm giá"
          >
            <FiX />
          </button>
        </div>
      ) : (
        <>
          <div className="voucher-input__row">
            <input
              id="voucher-code-input"
              type="text"
              className={`voucher-input__field ${error ? 'voucher-input__field--error' : ''}`}
              placeholder="Nhập mã giảm giá"
              value={code}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-label="Nhập mã voucher"
            />
            <button
              id="btn-apply-voucher"
              className="voucher-input__apply-btn"
              onClick={onApply}
              disabled={isLoading || !code.trim()}
              type="button"
            >
              {isLoading ? 'Đang áp dụng...' : 'Áp dụng'}
            </button>
          </div>

          {error && (
            <p className="voucher-input__error" role="alert">{error}</p>
          )}
          {success && (
            <p className="voucher-input__success" role="status">{success}</p>
          )}

          <button
            id="btn-browse-vouchers"
            className="voucher-input__browse-btn"
            type="button"
            onClick={() => {}}
          >
            Chọn hoặc nhập mã khác &rsaquo;
          </button>
        </>
      )}
    </section>
  );
};

export default VoucherInput;
