import styles from "./ReviewModal.module.css";

type ReviewItem = {
  bookId: number | string;
  bookTitle?: string;
  quantity?: number;
  hasReview?: boolean;
  coverImage?: string;
  coverImageUrl?: string;
  coverImgUrl?: string;
  image?: string;

  book?: {
    coverImage?: string;
    coverImageUrl?: string;
    coverImgUrl?: string;
  };
};

type ReviewOrder = {
  orderId: number | string;
  items?: ReviewItem[];
};

type Props = {
  order: ReviewOrder | null;
  onClose: () => void;
  onReview: (item: ReviewItem) => void;
  onViewReview: (item: ReviewItem) => void;
};

const getBookImage = (item: ReviewItem) =>
  item?.coverImage ||
  item?.coverImageUrl ||
  item?.coverImgUrl ||
  item?.book?.coverImage ||
  item?.book?.coverImageUrl ||
  item?.book?.coverImgUrl ||
  item?.image;

export default function ReviewModal({
  order,
  onClose,
  onReview,
  onViewReview,
}: Props) {
  if (!order) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3>Đánh giá sản phẩm</h3>

          <button
            className={styles.closeBtn}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          {order.items?.map((item) => {
            const image = getBookImage(item);

            return (
              <div
                key={item.bookId}
                className={styles.reviewItem}
              >
                <div className={styles.bookInfo}>
                  {image && (
                    <img
                      src={image}
                      alt={item.bookTitle}
                    />
                  )}

                  <div className={styles.bookText}>
                    <h4>{item.bookTitle}</h4>

                    <span>
                      Số lượng: {item.quantity || 1}
                    </span>
                  </div>
                </div>

                {!item.hasReview ? (
                  <button
                    className={styles.reviewBtn}
                    onClick={() => onReview(item)}
                  >
                    Đánh giá
                  </button>
                ) : (
                  <button
                    className={styles.viewBtn}
                    onClick={() => onViewReview(item)}
                  >
                    Xem đánh giá
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}