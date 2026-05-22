import { useState } from "react";

import { voucherService } from "../services/voucherService";

import type { CreateVoucherRequest, VoucherApiType } from "../types/voucher";
import "../styles/VoucherCreateModal.css";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ================= FORM TYPE =================

type VoucherFormState = {
  voucherCode: string;

  title: string;

  description: string;

  type: VoucherApiType;

  discountValue: string;

  maxDiscountAmount: string;

  minOrderValue: string;

  totalLimit: string;

  limitPerUser: string;

  minPoint: string;

  startDate: string;

  endDate: string;
};

// ================= INITIAL FORM =================

const initialForm: VoucherFormState = {
  voucherCode: "",

  title: "",

  description: "",

  type: "FIXED",

  discountValue: "",

  maxDiscountAmount: "",

  minOrderValue: "",

  totalLimit: "1",

  limitPerUser: "1",

  minPoint: "0",

  startDate: "",

  endDate: "",
};

export default function VoucherCreateModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<VoucherFormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof VoucherFormState, string>>>({});

  if (!open) return null;

  // ================= HANDLE CHANGE =================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name as keyof VoucherFormState]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ================= VALIDATE =================

  const validateForm = () => {
    const newErrors: Partial<Record<keyof VoucherFormState, string>> = {};

    if (!form.voucherCode.trim()) {
      newErrors.voucherCode = "Vui lòng nhập mã voucher";
    }

    if (!form.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề";
    }

    if (!form.discountValue) {
      newErrors.discountValue = "Vui lòng nhập giá trị giảm";
    }

    if (form.type === "PERCENTAGE" && Number(form.discountValue) > 100) {
      newErrors.discountValue = "Không được vượt quá 100%";
    }

    if (form.type === "PERCENTAGE" && !form.maxDiscountAmount) {
      newErrors.maxDiscountAmount = "Vui lòng nhập mức giảm tối đa";
    }

    if (!form.minOrderValue) {
      newErrors.minOrderValue = "Vui lòng nhập đơn tối thiểu";
    }

    if (!form.totalLimit) {
      newErrors.totalLimit = "Vui lòng nhập tổng lượt dùng";
    }

    if (!form.limitPerUser) {
      newErrors.limitPerUser = "Vui lòng nhập giới hạn mỗi user";
    }

    if (!form.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    }

    if (!form.endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    }

    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
      newErrors.endDate = "Ngày kết thúc phải lớn hơn ngày bắt đầu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= SUBMIT =================

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      setLoading(true);

      const payload: CreateVoucherRequest = {
        voucherCode: form.voucherCode.toUpperCase(),
        title: form.title,
        description: form.description,
        type: form.type,
        discountValue: Number(form.discountValue),
        maxDiscountAmount:
          form.type === "PERCENTAGE" ? Number(form.maxDiscountAmount) : 1,
        minOrderValue: Number(form.minOrderValue),
        totalLimit: Number(form.totalLimit),
        limitPerUser: Number(form.limitPerUser),
        minPoint: Number(form.minPoint),
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      };
      
      await voucherService.createVoucher(payload);
      alert("Tạo voucher thành công");
      onSuccess();
      onClose();
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      console.error(error);
      alert("Tạo voucher thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="voucher-modal-overlay">
      <div className="voucher-modal">
        <div className="voucher-modal-header">
          <h2>Tạo voucher mới</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="voucher-form-grid">
          {/* CODE */}
          <div className="form-group">
            <label>Mã voucher</label>
            <input
              name="voucherCode"
              className={errors.voucherCode ? "input-error" : ""}
              value={form.voucherCode}
              onChange={handleChange}
              placeholder="Ví dụ: SALE50"
            />
            {errors.voucherCode && <span className="error-message">{errors.voucherCode}</span>}
          </div>

          {/* TITLE */}
          <div className="form-group">
            <label>Tiêu đề</label>
            <input 
              name="title" 
              className={errors.title ? "input-error" : ""}
              value={form.title} 
              onChange={handleChange} 
              placeholder="Nhập tiêu đề voucher"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* DESCRIPTION */}
          <div className="form-group full-width">
            <label>Mô tả (Tùy chọn)</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập mô tả chi tiết về voucher..."
            />
          </div>

          {/* TYPE */}
          <div className="form-group">
            <label>Loại voucher</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="FIXED">FIXED (Giảm trực tiếp số tiền)</option>
              <option value="PERCENTAGE">PERCENTAGE (Giảm theo %)</option>
            </select>
          </div>

          {/* DISCOUNT VALUE */}
          <div className="form-group">
            <label>
              {form.type === "FIXED" ? "Số tiền giảm (đ)" : "Phần trăm giảm (%)"}
            </label>
            <input
              type="number"
              name="discountValue"
              className={errors.discountValue ? "input-error" : ""}
              value={form.discountValue}
              onChange={handleChange}
              placeholder="0"
            />
            {errors.discountValue && <span className="error-message">{errors.discountValue}</span>}
          </div>

          {/* MAX DISCOUNT */}
          {form.type === "PERCENTAGE" && (
            <div className="form-group">
              <label>Giảm tối đa (đ)</label>
              <input
                type="number"
                name="maxDiscountAmount"
                className={errors.maxDiscountAmount ? "input-error" : ""}
                value={form.maxDiscountAmount}
                onChange={handleChange}
                placeholder="0"
              />
              {errors.maxDiscountAmount && <span className="error-message">{errors.maxDiscountAmount}</span>}
            </div>
          )}

          {/* MIN ORDER */}
          <div className="form-group">
            <label>Đơn tối thiểu (đ)</label>
            <input
              type="number"
              name="minOrderValue"
              className={errors.minOrderValue ? "input-error" : ""}
              value={form.minOrderValue}
              onChange={handleChange}
              placeholder="0"
            />
            {errors.minOrderValue && <span className="error-message">{errors.minOrderValue}</span>}
          </div>

          {/* TOTAL LIMIT */}
          <div className="form-group">
            <label>Tổng lượt dùng</label>
            <input
              type="number"
              name="totalLimit"
              className={errors.totalLimit ? "input-error" : ""}
              value={form.totalLimit}
              onChange={handleChange}
              placeholder="1"
            />
            {errors.totalLimit && <span className="error-message">{errors.totalLimit}</span>}
          </div>

          {/* LIMIT PER USER */}
          <div className="form-group">
            <label>Giới hạn mỗi user</label>
            <input
              type="number"
              name="limitPerUser"
              className={errors.limitPerUser ? "input-error" : ""}
              value={form.limitPerUser}
              onChange={handleChange}
              placeholder="1"
            />
            {errors.limitPerUser && <span className="error-message">{errors.limitPerUser}</span>}
          </div>

          {/* MIN POINT */}
          <div className="form-group">
            <label>Điểm tối thiểu</label>
            <input
              type="number"
              name="minPoint"
              value={form.minPoint}
              onChange={handleChange}
              placeholder="0"
            />
          </div>

          {/* START DATE */}
          <div className="form-group">
            <label>Ngày bắt đầu</label>
            <input
              type="datetime-local"
              name="startDate"
              className={errors.startDate ? "input-error" : ""}
              value={form.startDate}
              onChange={handleChange}
            />
            {errors.startDate && <span className="error-message">{errors.startDate}</span>}
          </div>

          {/* END DATE */}
          <div className="form-group">
            <label>Ngày kết thúc</label>
            <input
              type="datetime-local"
              name="endDate"
              className={errors.endDate ? "input-error" : ""}
              value={form.endDate}
              onChange={handleChange}
            />
            {errors.endDate && <span className="error-message">{errors.endDate}</span>}
          </div>
        </div>

        <div className="voucher-modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Hủy
          </button>
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo voucher"}
          </button>
        </div>
      </div>
    </div>
  );
}
