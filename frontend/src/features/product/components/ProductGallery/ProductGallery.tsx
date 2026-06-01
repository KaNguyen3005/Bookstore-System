import React, { useEffect, useMemo, useState } from "react";

import type { Book } from "../types/Book";
import "../../pages/ProductDetailPage/ProductDetailPage.css";

interface Props {
  book: Book;
}

const ProductGallery: React.FC<Props> = ({
  book,
}) => {
  const galleryImages = useMemo(() => {
    const images = [
      book.coverImgUrl,
      ...(book.bookImgs?.map((image) => image.imgUrl) ?? []),
    ].filter((image): image is string => Boolean(image));

    return Array.from(new Set(images));
  }, [book.bookImgs, book.coverImgUrl]);

  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    setSelectedImage(galleryImages[0] ?? "");
  }, [galleryImages]);

  const mainImage =
    selectedImage ||
    galleryImages[0] ||
    "/default-book.png";

  return (
    <>
      <div className="main-image-wrapper">
        <img
          src={mainImage}
          alt={book.title}
          className="main-image"
          onError={(event) => {
            (event.currentTarget as HTMLImageElement).src = "/default-book.png";
          }}
        />
      </div>

      {galleryImages.length > 1 && (
        <div className="thumbnails-grid">
        {galleryImages.map((image, index) => (
          <div
            key={image}
            className={`thumb-box ${
              image === mainImage ? "thumb-box--active" : ""
            }`}
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image}
              alt={`${book.title} ${index + 1}`}
              onError={(event) => {
                (event.currentTarget as HTMLImageElement).src =
                  "/default-book.png";
              }}
            />
          </div>
        ))}
        </div>
      )}
    </>
  );
};

export default ProductGallery;
