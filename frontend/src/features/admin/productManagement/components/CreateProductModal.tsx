import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import CreatableSelect from "react-select/creatable";

import { Button } from "../../../../components/ui/Button";
import type { CreateBookPayload } from "../services/productService";

import { getAuthors } from "../../../../services/authorApi";
import { categoryService } from "../../../../features/book-category/services/categoryService";
import { publisherService } from "../../../../features/book-category/services/publisherService";

import "../styles/CreateProductModal.css";

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateBookPayload) => Promise<boolean>;
  loading: boolean;
}

type Option = {
  value: number;
  label: string;
};

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  open,
  onClose,
  onCreate,
  loading,
}) => {
  // ================= FORM =================
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    language: "Tiếng Việt",
    description: "",
    pageCount: "",
    coverType: "",
    price: "",
    coverImageUrl: "", // ✅ thêm URL ảnh
  });

  const [coverImgFile, setCoverImgFile] = useState<File | null>(null);

  // ================= SELECT =================
  const [selectedAuthors, setSelectedAuthors] = useState<Option[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [selectedPublisher, setSelectedPublisher] = useState<Option | null>(
    null,
  );

  // ================= OPTIONS =================
  const [authorOptions, setAuthorOptions] = useState<Option[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [publisherOptions, setPublisherOptions] = useState<Option[]>([]);

  // ================= LOAD DATA =================
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        const [authors, categories, publishers] = await Promise.all([
          getAuthors(),
          categoryService.getCategories(),
          publisherService.getPublishers(),
        ]);

        setAuthorOptions(
          authors.map((a: any) => ({
            value: a.authorId,
            label: a.authorName,
          })),
        );

        setCategoryOptions(
          categories.map((c: any) => ({
            value: c.categoryId,
            label: c.categoryName,
          })),
        );

        setPublisherOptions(
          publishers.map((p: any) => ({
            value: p.publisherId,
            label: p.publisherName,
          })),
        );
      } catch (error) {
        console.error("Load dropdown error:", error);
      }
    };

    fetchData();
  }, [open]);

  if (!open) return null;

  // ================= HANDLERS =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCoverImgFile(e.target.files[0]);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.isbn ||
      !formData.coverType ||
      !formData.price ||
      selectedAuthors.length === 0 ||
      selectedCategories.length === 0
    ) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc (*)");
      return;
    }

    const payload: CreateBookPayload = {
      title: formData.title,
      authorIds: selectedAuthors.map((a) => a.value),
      publisherId: selectedPublisher?.value,
      isbn: formData.isbn,
      language: formData.language,
      description: formData.description,
      pageCount: formData.pageCount ? parseInt(formData.pageCount) : undefined,
      coverType: formData.coverType,

      coverImgFile: coverImgFile || undefined, // upload file
      coverImgUrl: formData.coverImgUrl || undefined, // URL

      price: parseFloat(formData.price),
      categoryIds: selectedCategories.map((c) => c.value),
    };

    const success = await onCreate(payload);

    if (success) {
      onClose();

      setFormData({
        title: "",
        isbn: "",
        language: "Tiếng Việt",
        description: "",
        pageCount: "",
        coverType: "",
        price: "",
        coverImageUrl: "",
      });

      setSelectedAuthors([]);
      setSelectedCategories([]);
      setSelectedPublisher(null);
      setCoverImgFile(null);
    }
  };

  // ================= UI =================
  return (
    <div className="create-product-modal">
      <div className="create-product-modal__overlay" onClick={onClose} />

      <div className="create-product-modal__content">
        {/* HEADER */}
        <div className="create-product-modal__header">
          <div>
            <h2>Thêm sản phẩm</h2>
            <p>Tạo mới sách trong hệ thống</p>
          </div>

          <button onClick={onClose} className="create-product-modal__close">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="create-product-modal__body">
          <div className="create-product-form">

            {/* TITLE */}
            <div className="form-row">
              <div className="form-group">
                <label>Tên sách *</label>
                <input name="title" value={formData.title} onChange={handleChange} />
              </div>

              {/* ISBN */}
              <div className="form-group">
                <label>ISBN *</label>
                <input name="isbn" value={formData.isbn} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              {/* IMAGE FILE */}
              <div className="form-group">
                <label>Ảnh bìa (Upload file)</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>

              {/* IMAGE URL */}
              <div className="form-group">
                <label>Hoặc nhập URL ảnh</label>
                <input
                  name="coverImageUrl"
                  value={formData.coverImageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-row">
              {/* AUTHORS */}
              <div className="form-group">
                <label>Tác giả *</label>
                <CreatableSelect
                  isMulti
                  value={selectedAuthors}
                  options={authorOptions}
                  onChange={(val) => setSelectedAuthors((val as Option[]) || [])}
                />
              </div>

              {/* CATEGORY */}
              <div className="form-group">
                <label>Danh mục *</label>
                <CreatableSelect
                  isMulti
                  value={selectedCategories}
                  options={categoryOptions}
                  onChange={(val) =>
                    setSelectedCategories((val as Option[]) || [])
                  }
                />
              </div>
            </div>

            <div className="form-row">
              {/* PUBLISHER */}
              <div className="form-group">
                <label>Nhà xuất bản</label>
                <CreatableSelect
                  value={selectedPublisher}
                  options={publisherOptions}
                  onChange={(val) => setSelectedPublisher(val as Option)}
                />
              </div>

              {/* LANGUAGE */}
              <div className="form-group">
                <label>Ngôn ngữ</label>
                <select name="language" value={formData.language} onChange={handleChange}>
                  <option value="Tiếng Việt">Tiếng Việt</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                  <option value="Tiếng Nhật">Tiếng Nhật</option>
                  <option value="Tiếng Trung">Tiếng Trung</option>
                  <option value="Tiếng Hàn">Tiếng Hàn</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              {/* PRICE */}
              <div className="form-group">
                <label>Giá *</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              {/* STOCK */}
              <div className="form-group">
                <label>Số trang</label>
                <input
                  name="pageCount"
                  type="number"
                  min="0"
                  value={formData.pageCount}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              {/* COVER TYPE */}
              <div className="form-group">
                <label>Loại bìa *</label>
                <select name="coverType" value={formData.coverType} onChange={handleChange}>
                  <option value="">Chọn loại bìa</option>
                  <option value="Bìa mềm">Bìa mềm</option>
                  <option value="Bìa cứng">Bìa cứng</option>
                </select>
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả ngắn về nội dung sách..."
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="create-product-modal__footer">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>

          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm sản phẩm"}
          </Button>
        </div>
      </div>
    </div>
  );
};
