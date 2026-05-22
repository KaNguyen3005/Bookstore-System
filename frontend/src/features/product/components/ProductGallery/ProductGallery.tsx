import React from "react";

import type { Book } from "../types/Book";
import "../../pages/ProductDetailPage/ProductDetailPage.css";

interface Props {
  book: Book;
}

const ProductGallery: React.FC<Props> = ({
  book,
}) => {
  return (
    <>
      <div className="main-image-wrapper">
        <img
          src={
            book.coverImgUrl ||
            `https://picsum.photos/seed/book${book.bookId}/400/600`
          }
          alt={book.title}
          className="main-image"
        />
      </div>

      <div className="thumbnails-grid">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="thumb-box"
          >
            <img
              src={`https://picsum.photos/seed/book${
                book.bookId + i
              }/100/150`}
              alt="thumb"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductGallery;