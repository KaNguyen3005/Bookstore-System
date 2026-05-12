import React from "react";

import type { Book } from "../types/Book";
import "../../pages/ProductDetailPage/ProductDetailPage.css";

interface Props {
  book: Book;
  publisherName: string;
  authorName: string;
}

const ProductSpecs: React.FC<Props> = ({
  book,
  publisherName,
  authorName,
}) => {
  return (
    <div className="product-card-white mt-4 specs-card">
      <h3 className="card-title">
        Thông tin chi tiết
      </h3>

      <table className="specs-table">
        <tbody>
          <tr>
            <td>Mã hàng</td>
            <td>{book.bookId}</td>
          </tr>

          <tr>
            <td>Nhà xuất bản</td>

            <td>{publisherName}</td>
          </tr>

          <tr>
            <td>Tác giả</td>

            <td>{authorName}</td>
          </tr>

          <tr>
            <td>Ngôn ngữ</td>

            <td>
              {book.language ||
                "Tiếng Việt"}
            </td>
          </tr>

          <tr>
            <td>Số trang</td>

            <td>
              {book.pageCount || 0}
            </td>
          </tr>

          <tr>
            <td>ISBN</td>

            <td>
              {book.isbn ||
                "Đang cập nhật"}
            </td>
          </tr>

          <tr>
            <td>Hình thức</td>

            <td>
              {book.coverType ||
                "Bìa mềm"}
            </td>
          </tr>

          <tr>
            <td>Tồn kho</td>

            <td>
              {book.stockQuantity ||
                0}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductSpecs;