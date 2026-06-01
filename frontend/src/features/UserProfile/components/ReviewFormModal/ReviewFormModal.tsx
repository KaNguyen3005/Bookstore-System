import { useState } from "react";
import styles from "./ReviewFormModal.module.css";
import { reviewOrderItem } from "../../../../services/orderApi";

export default function ReviewFormModal({
  item,
  onClose,
  onSuccess,
}: {
  item: any;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!item) return null;

  const handleSubmit = async () => {

    if (!content.trim()) {
      setError("Không được bỏ trống");
      return;
    }

    const reviewItemId = item.orderItemId ?? item.itemId;

    if (!item.orderId || !reviewItemId) {
      setError("Không thể xác định sản phẩm cần đánh giá");
      return;
    }

    setError(""); // clear error nếu hợp lệ

    try {
      setLoading(true);

      await reviewOrderItem(
        item.orderId,
        reviewItemId,
        {
          rating,
          content,
        }
      );

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Review error:", err);
      alert("Gửi đánh giá thất bại!");
    } finally {
      setLoading(false);
    }
  };


    const imageUrl =
      item.coverImageUrl ??
      item.bookImgs?.[0]?.imgUrl ??
      "/default-book.png";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.bookInfo}>
          <img
            src={imageUrl}
            alt={item.bookTitle}
            className={styles.bookImage}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/default-book.png";
            }}
          />

          <div className={styles.bookText}>
            <div className={styles.title}>
              Đánh giá sản phẩm
            </div>

            <div className={styles.bookName}>
              {item.bookTitle}
            </div>
          </div>
        </div>

        <div className={styles.ratingBox}>
          <label>Số sao:</label>
          <div className={styles.starSelect}>
            <label>Chọn số sao</label>

            <div className={styles.starRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.starBtn} ${
                    rating >= star ? styles.active : ""
                  }`}
                  onClick={() => setRating(star)}
                >
                  ⭐
                </button>
              ))}

              <span className={styles.starText}>
                {rating === 5 && "Rất tốt"}
                {rating === 4 && "Tốt"}
                {rating === 3 && "Bình thường"}
                {rating === 2 && "Tệ"}
                {rating === 1 && "Rất tệ"}
              </span>
            </div>
          </div>
        </div>

        <textarea
          className={`${styles.textarea} ${error ? styles.errorInput : ""}`}
          placeholder="Nhận xét của bạn..."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (e.target.value.trim()) setError("");
          }}
        />

        {error && <div className={styles.errorText}>{error}</div>}

        <div className={styles.actions}>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>

          <button
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
