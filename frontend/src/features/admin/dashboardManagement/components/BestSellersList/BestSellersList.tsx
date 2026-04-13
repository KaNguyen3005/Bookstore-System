import React from "react";
import type { Book } from "../../../../product/types/Book";
import "./BestSellersList.css";

interface BestSellersListProps {
  books: Book[];
}

const BestSellersList: React.FC<BestSellersListProps> = ({ books }) => {
  return (
    <div className="best-sellers">
      <h3 className="best-sellers-title">Top sách bán chạy</h3>
      <div className="best-sellers-grid">
        {books.map((book) => (
          <div key={book.book_id} className="best-seller-card">
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="book-cover"
            />
            <div style={{ flex: 1 }}>
              <span className="best-badge">#BEST</span>
              <h4 className="book-title">{book.title}</h4>
              <p className="book-author">{book.author_name}</p>
              <div className="book-stats">
                <span className="book-price">{book.price.toLocaleString()}đ</span>
                <span className="book-sold">Đã bán: {Math.floor(Math.random() * 500) + 100}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellersList;
