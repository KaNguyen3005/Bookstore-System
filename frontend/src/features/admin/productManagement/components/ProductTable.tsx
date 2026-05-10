import React from "react";

import {
  Edit,
  Trash2,
} from "lucide-react";

import type { Book } from "../../../product/types/Book";

import "../styles/ProductTable.css";

interface ProductTableProps {
  products: Book[];

  loading: boolean;

  onDelete: (bookId: number) => void;

  onUpdateStatus: (
    bookId: number,
    isActive: boolean
  ) => void;
}

export const ProductTable: React.FC<
  ProductTableProps
> = ({
  products,
  loading,
  onDelete,
  onUpdateStatus,
}) => {

  // ================= FORMAT PRICE =================
  const formatCurrency = (
    amount: number
  ) => {
    return new Intl.NumberFormat(
      "vi-VN",
      {
        style: "currency",
        currency: "VND",
      }
    )
      .format(amount)
      .replace("₫", "đ");
  };

  // ================= STATUS =================
  const getStatus = (
    book: Book
  ) => {
    if (!book.isActive)
      return "Tạm ngưng";

    if (book.stockQuantity <= 0)
      return "Hết hàng";

    return "Đang bán";
  };

  const getBadgeClass = (
    status: string
  ) => {
    switch (status) {
      case "Đang bán":
        return "product-badge--success";

      case "Hết hàng":
        return "product-badge--danger";

      case "Tạm ngưng":
        return "product-badge--warning";

      default:
        return "";
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Đang tải danh sách sản phẩm...
      </div>
    );
  }

  return (
    <div className="product-table__wrapper">
      <table className="product-table">

        {/* HEADER */}
        <thead className="product-table__thead">
          <tr>
            <th className="product-table__th">
              ID
            </th>

            <th className="product-table__th">
              Sản phẩm
            </th>

            <th className="product-table__th">
              Thể loại
            </th>

            <th className="product-table__th">
              Giá bán
            </th>

            <th className="product-table__th">
              Kho hàng
            </th>

            <th className="product-table__th">
              Đánh giá
            </th>

            <th className="product-table__th">
              Trạng thái
            </th>

            <th className="product-table__th">
              Thao tác
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {products.map((book) => {
            const status =
              getStatus(book);

            return (
              <tr
                key={book.bookId}
                className="product-table__tr"
              >

                {/* ID */}
                <td className="product-table__td">
                  {book.bookId}
                </td>

                {/* PRODUCT */}
                <td className="product-table__td">
                  <div className="product-table__info">

                    <img
                      src={book.coverImgUrl}
                      alt={book.title}
                      className="product-table__img"
                    />

                    <div>
                      <div className="product-table__name">
                        {book.title}
                      </div>

                      <div className="product-table__author">
                        {book.authors
                          ?.map(
                            (author) =>
                              author.alias ||
                              author.authorName
                          )
                          .join(", ")}
                      </div>
                    </div>
                  </div>
                </td>

                {/* CATEGORY */}
                <td className="product-table__td">
                  <span className="product-table__category">
                    {book.categories?.join(
                      ", "
                    )}
                  </span>
                </td>

                {/* PRICE */}
                <td className="product-table__td">
                  <span className="product-table__price">
                    {formatCurrency(
                      book.price
                    )}
                  </span>
                </td>

                {/* STOCK */}
                <td className="product-table__td">
                  <span
                    className={`product-table__stock ${
                      book.stockQuantity <= 0
                        ? "product-table__stock--out"
                        : ""
                    }`}
                  >
                    {book.stockQuantity}
                  </span>
                </td>

                {/* RATING */}
                <td className="product-table__td">
                  {book.avgRating ?? 0}
                </td>

                {/* STATUS */}
                <td className="product-table__td">
                  <span
                    className={`product-badge ${getBadgeClass(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </td>

                {/* ACTION */}
                <td className="product-table__td">
                  <div className="product-table__actions">

                    <Edit
                      className="product-table__action product-table__action--edit"
                      size={18}
                    />

                    <Trash2
                      className="product-table__action product-table__action--delete"
                      size={18}
                      onClick={() =>
                        onDelete(
                          book.bookId
                        )
                      }
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};