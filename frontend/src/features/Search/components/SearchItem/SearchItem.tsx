import styles from "./SearchItem.module.css";

export interface Book {
  bookId: number;
  title: string;
  price: number;
  salePercent: number;
  coverImgUrl: string;
  avgRating: number;
  stockQuantity: number;

  categories: string[];
  authors: { authorName: string }[];
  publisher?: {
    publisherName: string;
  };
}

interface Props {
  book: Book;
  onSelect: (value: string) => void;
}

export default function SearchItem({ book, onSelect }: Props) {
  const finalPrice =
    book.price - (book.price * book.salePercent) / 100;

  const image =
    book.coverImgUrl || "/images/book-placeholder.svg";

  const category =
    book.categories?.length > 0
      ? book.categories[0]
      : "Chưa phân loại";

  return (
    <div
      className={styles.item}
      onClick={() => onSelect(book.title)}
    >
      {/* IMAGE */}
      <img
        className={styles.image}
        src={image}
        alt={book.title}
      />

      {/* CONTENT */}
      <div className={styles.content}>
        <div className={styles.title}>
          {book.title}
        </div>

        <div className={styles.meta}>
          <span className={styles.category}>
            {category}
          </span>

          <span className={styles.price}>
            {finalPrice.toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>
    </div>
  );
}