import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchApi } from "../../../../services/searchApi";
import type { Book } from "../../../../features/product/types/Book";
import "./SearchPage.css";

export default function SearchPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const keyword = decodeURIComponent(query.get("q") || "");

  useEffect(() => {
    if (!keyword) return;

    setLoading(true);

    searchApi.searchBooks(keyword, 50).then((res) => {
      setBooks(res);
      setLoading(false);
    });
  }, [keyword]);

  return (
    <div className="search-page">
      <h2>
        Kết quả cho: <span>"{keyword}"</span>
      </h2>

      {loading ? (
        <p className="loading">Đang tìm kiếm...</p>
      ) : books.length === 0 ? (
        <p className="empty">Không tìm thấy sách</p>
      ) : (
        <div className="search-grid">
          {books.map((book) => {
            const finalPrice = book.price;

            return (
              <div key={book.book_id} className="book-card">
                <img src={book.cover_image_url} />

                <p className="title">{book.title}</p>

                <p className="price">
                  {finalPrice.toLocaleString("vi-VN")}đ
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}