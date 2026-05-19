import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import CreatableSelect from "react-select/creatable";

import { Button } from "../../../../components/ui/Button";
import { getAuthors } from "../../../../services/authorApi";
import { categoryService } from "../../../book-category/services/categoryService";
import { publisherService } from "../../../book-category/services/publisherService";
import type { Category } from "../../../book-category/types/category";
import type { Book } from "../../../product/types/Book";
import type { UpdateBookPayload } from "../services/productService";
import "../styles/CreateProductModal.css";

type Option = {
  value: number;
  label: string;
};

interface ProductEditModalProps {
  product: Book | null;
  loading: boolean;
  onClose: () => void;
  onUpdate: (bookId: number, payload: UpdateBookPayload) => Promise<boolean>;
}

const flattenCategories = (categories: Category[]): Category[] => {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children ?? []),
  ]);
};

const isValidIsbn = (isbn: string) => {
  const normalizedIsbn = isbn.replace(/[-\s]/g, "");

  return /^(?:\d{9}[\dXx]|\d{13})$/.test(normalizedIsbn);
};

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  loading,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    language: "",
    description: "",
    pageCount: "",
    coverType: "",
    stockQuantity: "",
    stockAdjustment: "",
    isActive: true,
    price: "",
    avgRating: "",
  });
  const [coverImg, setCoverImg] = useState<File | null>(null);
  const [selectedAuthors, setSelectedAuthors] = useState<Option[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [selectedPublisher, setSelectedPublisher] = useState<Option | null>(null);
  const [authorOptions, setAuthorOptions] = useState<Option[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [publisherOptions, setPublisherOptions] = useState<Option[]>([]);
  const [isbnError, setIsbnError] = useState("");

  useEffect(() => {
    if (!product) return;

    setFormData({
      title: product.title ?? "",
      isbn: product.isbn ?? "",
      language: product.language ?? "",
      description: product.description ?? "",
      pageCount: String(product.pageCount ?? ""),
      coverType: product.coverType ?? "",
      stockQuantity: String(product.stockQuantity ?? ""),
      stockAdjustment: "",
      isActive: Boolean(product.isActive),
      price: String(product.price ?? ""),
      avgRating: String(product.avgRating ?? ""),
    });
    setSelectedAuthors(
      product.authors?.map((author) => ({
        value: Number(author.authorId),
        label: author.authorName,
      })) ?? [],
    );
    setSelectedPublisher(
      product.publisher
        ? {
            value: Number(product.publisher.publisherId),
            label: product.publisher.publisherName,
          }
        : null,
    );
    setCoverImg(null);
    setIsbnError("");
  }, [product]);

  useEffect(() => {
    if (!product) return;

    const fetchOptions = async () => {
      try {
        const [authors, categories, publishers] = await Promise.all([
          getAuthors(),
          categoryService.getCategories(),
          publisherService.getPublishers(),
        ]);
        const nextCategoryOptions = flattenCategories(categories).map((category) => ({
          value: Number(category.categoryId),
          label: category.categoryName,
        }));

        setAuthorOptions(
          authors.map((author) => ({
            value: Number(author.authorId),
            label: author.authorName,
          })),
        );
        setCategoryOptions(nextCategoryOptions);
        setPublisherOptions(
          publishers.map((publisher) => ({
            value: Number(publisher.publisherId),
            label: publisher.publisherName,
          })),
        );
        setSelectedCategories(
          nextCategoryOptions.filter((option) =>
            product.categories?.includes(option.label),
          ),
        );
      } catch (error) {
        console.error("Load edit product options failed:", error);
      }
    };

    fetchOptions();
  }, [product]);

  const canSubmit = useMemo(
    () =>
      Boolean(
        formData.title &&
          formData.isbn &&
          formData.coverType &&
          formData.price &&
          selectedAuthors.length > 0 &&
          selectedCategories.length > 0,
      ),
    [formData, selectedAuthors.length, selectedCategories.length],
  );

  if (!product) return null;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "isbn") {
      setIsbnError("");
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc (*)");
      return;
    }

    if (!isValidIsbn(formData.isbn)) {
      setIsbnError(
        "ISBN không đúng định dạng. Ví dụ hợp lệ: 978-604-2-12345-6 hoặc 0306406152.",
      );
      return;
    }

    const currentStock = Number(formData.stockQuantity) || 0;
    const stockAdjustment = formData.stockAdjustment
      ? Number(formData.stockAdjustment)
      : 0;
    const nextStockQuantity = Math.max(0, currentStock + stockAdjustment);

    const success = await onUpdate(product.bookId, {
      title: formData.title.trim(),
      authorIds: selectedAuthors.map((author) => author.value),
      publisherId: selectedPublisher?.value,
      isbn: formData.isbn.trim(),
      language: formData.language.trim(),
      description: formData.description.trim(),
      pageCount: formData.pageCount ? Number(formData.pageCount) : undefined,
      coverType: formData.coverType,
      coverImg: coverImg ?? undefined,
      stockQuantity: nextStockQuantity,
      isActive: formData.isActive,
      price: Number(formData.price),
      avgRating: formData.avgRating ? Number(formData.avgRating) : undefined,
      categories: selectedCategories.map((category) => category.value),
    });

    if (success) onClose();
  };

  return (
    <div className="create-product-modal">
      <div className="create-product-modal__overlay" onClick={onClose} />

      <div className="create-product-modal__content">
        <div className="create-product-modal__header">
          <div>
            <h2>Sửa sản phẩm</h2>
            <p>Cập nhật thông tin sách #{product.bookId}</p>
          </div>

          <button onClick={onClose} className="create-product-modal__close">
            <X size={20} />
          </button>
        </div>

        <div className="create-product-modal__body">
          <div className="create-product-form">
            <div className="form-row">
              <div className="form-group">
                <label>Tên sách *</label>
                <input name="title" value={formData.title} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>ISBN *</label>
                <input name="isbn" value={formData.isbn} onChange={handleChange} />
                {isbnError && <span className="field-error">{isbnError}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tác giả *</label>
                <CreatableSelect
                  isMulti
                  value={selectedAuthors}
                  options={authorOptions}
                  onChange={(value) => setSelectedAuthors((value as Option[]) || [])}
                />
              </div>
              <div className="form-group">
                <label>Danh mục *</label>
                <CreatableSelect
                  isMulti
                  value={selectedCategories}
                  options={categoryOptions}
                  onChange={(value) =>
                    setSelectedCategories((value as Option[]) || [])
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nhà xuất bản</label>
                <CreatableSelect
                  value={selectedPublisher}
                  options={publisherOptions}
                  onChange={(value) => setSelectedPublisher(value as Option)}
                />
              </div>
              <div className="form-group">
                <label>Ảnh bìa mới</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setCoverImg(event.target.files?.[0] ?? null)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ngôn ngữ</label>
                <input name="language" value={formData.language} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Loại bìa *</label>
                <select name="coverType" value={formData.coverType} onChange={handleChange}>
                  <option value="">Chọn loại bìa</option>
                  <option value="Bìa mềm">Bìa mềm</option>
                  <option value="Bìa cứng">Bìa cứng</option>
                </select>
              </div>
            </div>

            <div className="form-row">
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
              <div className="form-group">
                <label>Tồn kho</label>
                <input
                  name="stockQuantity"
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  readOnly
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Điều chỉnh tồn kho</label>
                <input
                  name="stockAdjustment"
                  type="number"
                  value={formData.stockAdjustment}
                  onChange={handleChange}
                  placeholder="Ví dụ: 5 hoặc -3"
                />
                <span className="form-helper-text">
                  Nhập số dương để thêm, số âm để khấu trừ.
                </span>
              </div>
              <div className="form-group">
                <label>Giá *</label>
                <input name="price" type="number" min="0" value={formData.price} onChange={handleChange} />
              </div>
              <label className="product-active-toggle">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: event.target.checked,
                    }))
                  }
                />
                <span className="product-active-toggle__text">
                  Trạng thái hoạt động:{" "}
                  <strong>{formData.isActive ? "ĐANG BẬT" : "ĐANG TẮT"}</strong>
                </span>
                <span className="product-active-toggle__switch" aria-hidden="true" />
              </label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Đánh giá</label>
                <input
                  name="avgRating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.avgRating}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="create-product-modal__footer">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>
    </div>
  );
};
