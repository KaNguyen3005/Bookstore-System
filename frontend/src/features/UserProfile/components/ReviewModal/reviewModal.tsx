import styles from "./reviewModal.module.css";

type ReviewItem = {
  bookId: number | string;
  orderId?: number | string;
  itemId?: number | string;
  orderItemId?: number | string;
  bookTitle?: string;
  quantity?: number;
  hasReview?: boolean;
  hasRating?: boolean;
  rate?: number | null;
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
            const reviewItemId = item.orderItemId ?? item.itemId;
            const isReviewed =
              item.hasReview === true ||
              item.hasRating === true ||
              (typeof item.rate === "number" && item.rate > 0);

            return (
              <div
                key={reviewItemId ?? item.bookId}
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

                {isReviewed ? (
                  <button className={styles.reviewedBtn} disabled>
                    Đã đánh giá
                  </button>
                ) : (
                  <button
                    className={styles.reviewBtn}
                    disabled={!reviewItemId}
                    onClick={() =>
                      reviewItemId && onReview({
                        ...item,
                        orderId: order.orderId,
                        itemId: reviewItemId,
                        orderItemId: reviewItemId,
                      })
                    }
                  >
                    Đánh giá
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
