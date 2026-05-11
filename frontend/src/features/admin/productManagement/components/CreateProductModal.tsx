import React, { useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '../../../../components/ui/Button';
import type { CreateBookPayload } from '../services/productService';

import '../styles/CreateProductModal.css';

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateBookPayload) => Promise<boolean>;
  loading: boolean;
}

export const CreateProductModal: React.FC<
  CreateProductModalProps
> = ({
  open,
  onClose,
  onCreate,
  loading,
}) => {

  const [formData, setFormData] = useState({
    title: '',
    authorIds: '',
    publisherId: '',
    isbn: '',
    language: 'Tiếng Việt',
    description: '',
    pageCount: '',
    coverType: '',
    stockQuantity: '0',
    price: '',
    avgRating: '5.0',
    salePercent: '0',
    categoryIds: '',
  });

  const [coverImgFile, setCoverImgFile] = useState<File | null>(null);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImgFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (
      !formData.title ||
      !formData.authorIds ||
      !formData.isbn ||
      !formData.coverType ||
      !formData.price ||
      !formData.categoryIds
    ) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc (*)");
      return;
    }

    const payload: CreateBookPayload = {
      title: formData.title,
      authorIds: formData.authorIds
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id)),
      publisherId: formData.publisherId
        ? parseInt(formData.publisherId)
        : undefined,
      isbn: formData.isbn,
      language: formData.language,
      description: formData.description,
      pageCount: formData.pageCount
        ? parseInt(formData.pageCount)
        : undefined,
      coverType: formData.coverType,
      coverImgFile: coverImgFile || undefined,
      stockQuantity: formData.stockQuantity
        ? parseInt(formData.stockQuantity)
        : undefined,
      price: parseFloat(formData.price),
      avgRating: formData.avgRating
        ? parseFloat(formData.avgRating)
        : undefined,
      salePercent: formData.salePercent
        ? parseFloat(formData.salePercent)
        : undefined,
      categoryIds: formData.categoryIds
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id)),
    };

    const success = await onCreate(payload);
    if (success) {
      onClose();
      // Reset form
      setFormData({
        title: '',
        authorIds: '',
        publisherId: '',
        isbn: '',
        language: 'Tiếng Việt',
        description: '',
        pageCount: '',
        coverType: '',
        stockQuantity: '0',
        price: '',
        avgRating: '5.0',
        salePercent: '0',
        categoryIds: '',
      });
      setCoverImgFile(null);
    }
  };

  return (
    <div className="create-product-modal">

      {/* Overlay */}
      <div
        className="create-product-modal__overlay"
        onClick={onClose}
      />

      {/* Content */}
      <div className="create-product-modal__content">

        {/* Header */}
        <div className="create-product-modal__header">

          <div>
            <h2>
              Thêm sản phẩm
            </h2>

            <p>
              Tạo mới sách trong hệ thống
            </p>
          </div>

          <button
            className="create-product-modal__close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="create-product-modal__body">

          <div className="create-product-form">

            {/* TITLE */}
            <div className="form-group">
              <label>Tên sách *</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tên sách..."
              />
            </div>

            {/* AUTHOR IDS + PUBLISHER */}
            <div className="form-row">

              <div className="form-group">
                <label>Author IDs *</label>

                <input
                  type="text"
                  name="authorIds"
                  value={formData.authorIds}
                  onChange={handleChange}
                  placeholder="Ví dụ: 1,2"
                />
              </div>

              <div className="form-group">
                <label>Publisher ID</label>

                <input
                  type="number"
                  name="publisherId"
                  value={formData.publisherId}
                  onChange={handleChange}
                  placeholder="Nhập publisher id"
                />
              </div>

            </div>

            {/* ISBN + LANGUAGE */}
            <div className="form-row">

              <div className="form-group">
                <label>ISBN *</label>

                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="978..."
                />
              </div>

              <div className="form-group">
                <label>Ngôn ngữ *</label>

                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="Tiếng Việt"
                />
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label>Mô tả</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Nhập mô tả sản phẩm..."
              />
            </div>

            {/* PAGE COUNT + COVER TYPE */}
            <div className="form-row">

              <div className="form-group">
                <label>Số trang</label>

                <input
                  type="number"
                  name="pageCount"
                  value={formData.pageCount}
                  onChange={handleChange}
                  placeholder="300"
                />
              </div>

              <div className="form-group">
                <label>Loại bìa *</label>

                <select
                  name="coverType"
                  value={formData.coverType}
                  onChange={handleChange}
                >
                  <option value="">
                    Chọn loại bìa
                  </option>

                  <option value="Bìa mềm">
                    Bìa mềm
                  </option>

                  <option value="Bìa cứng">
                    Bìa cứng
                  </option>
                </select>
              </div>

            </div>

            {/* IMAGE */}
            <div className="form-group">
              <label>Ảnh bìa</label>

              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            {/* STOCK + PRICE */}
            <div className="form-row">

              <div className="form-group">
                <label>Số lượng</label>

                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label>Giá *</label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="100000"
                />
              </div>

            </div>

            {/* RATING + SALE */}
            <div className="form-row">

              <div className="form-group">
                <label>Đánh giá</label>

                <input
                  type="number"
                  name="avgRating"
                  value={formData.avgRating}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="5.0"
                />
              </div>

              <div className="form-group">
                <label>Giảm giá (%)</label>

                <input
                  type="number"
                  name="salePercent"
                  value={formData.salePercent}
                  onChange={handleChange}
                  placeholder="10"
                />
              </div>

            </div>

            {/* CATEGORY IDS */}
            <div className="form-group">
              <label>Category IDs *</label>

              <input
                type="text"
                name="categoryIds"
                value={formData.categoryIds}
                onChange={handleChange}
                placeholder="Ví dụ: 1,2,3"
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="create-product-modal__footer">

          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>

          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang thêm..." : "Thêm sản phẩm"}
          </Button>

        </div>
      </div>
    </div>
  );
};