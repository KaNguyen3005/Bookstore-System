import { X } from "lucide-react";
import type { Book } from "../../../product/types/Book";
import { Button } from "../../../../components/ui/Button";
import "../styles/CreateProductModal.css";

interface ProductDetailModalProps {
  product: Book | null;
  onClose: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(amount)
    .replace("₫", "đ");

const getProductStatus = (product: Book) => {
  if (!product.isActive) return "Tạm ngưng";
  if (product.stockQuantity <= 0) return "Hết hàng";

  return "Đang bán";
};

export const ProductDetailModal = ({
  product,
  onClose,
}: ProductDetailModalProps) => {
  if (!product) return null;

  return (
    <div className="create-product-modal">
      <div className="create-product-modal__overlay" onClick={onClose} />

      <div className="create-product-modal__content">
        <div className="create-product-modal__header">
          <div>
            <h2>Chi tiết sản phẩm</h2>
            <p>Thông tin sách #{product.bookId}</p>
          </div>

          <button onClick={onClose} className="create-product-modal__close">
            <X size={20} />
          </button>
        </div>

        <div className="create-product-modal__body">
          <div className="admin-product-detail-layout">
            <img
              src={product.coverImgUrl}
              alt={product.title}
              className="admin-product-detail-cover"
            />

            <div className="admin-product-detail-grid">
              <div>
                <span>Tên sách</span>
                <strong>{product.title}</strong>
              </div>
              <div>
                <span>Tác giả</span>
                <strong>
                  {product.authors
                    ?.map((author) => author.alias || author.authorName)
                    .join(", ") || "Chưa cập nhật"}
                </strong>
              </div>
              <div>
                <span>Nhà xuất bản</span>
                <strong>{product.publisher?.publisherName || "Chưa cập nhật"}</strong>
              </div>
              <div>
                <span>Danh mục</span>
                <strong>{product.categories?.join(", ") || "Chưa cập nhật"}</strong>
              </div>
              <div>
                <span>ISBN</span>
                <strong>{product.isbn}</strong>
              </div>
              <div>
                <span>Ngôn ngữ</span>
                <strong>{product.language}</strong>
              </div>
              <div>
                <span>Loại bìa</span>
                <strong>{product.coverType}</strong>
              </div>
              <div>
                <span>Số trang</span>
                <strong>{product.pageCount}</strong>
              </div>
              <div>
                <span>Giá</span>
                <strong>{formatCurrency(product.price)}</strong>
              </div>
              <div>
                <span>Tồn kho</span>
                <strong>{product.stockQuantity}</strong>
              </div>
              <div>
                <span>Trạng thái</span>
                <strong>{getProductStatus(product)}</strong>
              </div>
              <div>
                <span>Đánh giá</span>
                <strong>{product.avgRating ?? 0}</strong>
              </div>
            </div>
          </div>

          <div className="admin-product-detail-description">
            <span>Mô tả</span>
            <p>{product.description || "Chưa có mô tả"}</p>
          </div>
        </div>

        <div className="create-product-modal__footer">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};
