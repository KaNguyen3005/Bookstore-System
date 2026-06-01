import React, { useMemo, useState, useEffect, useRef } from "react";
import styles from "./Evaluate.module.css";
import { Star, ThumbsUp, MessageCircle, Filter } from "lucide-react";

export interface Review {
  bookId: number | null;
  bookTitle: string | null;
  quantity: number;
  price: number | null;
  rate: number;
  content: string;
  unit: string;
}

interface EvaluateProps {
  reviews?: Review[];
  myReview?: Review | null;
  orderStatus?: string | null;
  onSubmitReview?: (data: {
    rating: number;
    content: string;
  }) => Promise<boolean>;
}

const filters = ["Tất cả", "5 sao", "4 sao", "3 sao", "2 sao", "1 sao"];

const Evaluate: React.FC<EvaluateProps> = ({
  reviews = [],
  myReview = null,
  orderStatus = null,
  onSubmitReview,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [selectedFilter, setSelectedFilter] = useState("Tất cả");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [visibleCount, setVisibleCount] = useState(4);

  const hasOrder = orderStatus !== null;
  const canReview = orderStatus === "DELIVERED" || orderStatus === "COMPLETED";

  // reset khi đổi filter
  useEffect(() => {
    setVisibleCount(4);
  }, [selectedFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setSubmitError("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    if (!onSubmitReview) {
      setSubmitError("Không thể gửi đánh giá cho sản phẩm này.");
      return;
    }

    try {
      setSubmitError("");
      setIsSubmitting(true);

      const success = await onSubmitReview({
        rating,
        content: trimmedContent,
      });

      if (success) {
        setContent("");
        setRating(5);
      }
    } catch (error: any) {
      setSubmitError(
        error?.response?.data?.message ||
          error?.message ||
          "Gửi đánh giá thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // AVG
  const averageRating = useMemo(() => {
    if (!reviews.length) return "0.0";
    const total = reviews.reduce((sum, item) => sum + item.rate, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  // FILTER
  const filteredReviews = useMemo(() => {
    if (selectedFilter === "Tất cả") return reviews;
    const star = Number(selectedFilter.replace(" sao", ""));
    return reviews.filter((item) => item.rate === star);
  }, [reviews, selectedFilter]);

  // VISIBLE
  const visibleReviews = useMemo(() => {
    return filteredReviews.slice(0, visibleCount);
  }, [filteredReviews, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const handleShowLess = () => {
    setVisibleCount(4);

    // FIX SCROLL
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  // STARS
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? styles.activeStar : styles.star}
        fill={index < rating ? "currentColor" : "none"}
      />
    ));

  return (
    <section ref={sectionRef} className={styles.container}>

      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Đánh giá sản phẩm</h2>

          <div className={styles.ratingSummary}>
            <span className={styles.average}>{averageRating}</span>

            <div>
              <div className={styles.stars}>
                {renderStars(Math.round(Number(averageRating)))}
              </div>

              <p className={styles.total}>
                {reviews.length} đánh giá
              </p>
            </div>
          </div>
        </div>

        {/* FILTER */}
        <div className={styles.filters}>
          <div className={styles.filterLabel}>
            <Filter size={16} />
            Bộ lọc:
          </div>

          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedFilter(item)}
              className={`${styles.filterBtn} ${
                selectedFilter === item ? styles.active : ""
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* FORM */}
      {!hasOrder ? (
        myReview && (
          <div className={styles.myReviewBox}>
            <h3>Đánh giá của bạn</h3>
            <div className={styles.myReviewStars}>
              {renderStars(myReview.rate)}
            </div>
            <p className={styles.myReviewText}>{myReview.content}</p>
            <button className={styles.editBtn}>Chỉnh sửa đánh giá</button>
          </div>
        )
      ) : !canReview ? (
        <div className={styles.empty}>
          Đơn hàng của bạn đang được xử lý / chưa giao.
        </div>
      ) : myReview ? (
        <div className={styles.myReviewBox}>
          <h3>Đánh giá của bạn</h3>
          <div className={styles.myReviewStars}>
            {renderStars(myReview.rate)}
          </div>
          <p className={styles.myReviewText}>{myReview.content}</p>
          <button className={styles.editBtn}>Chỉnh sửa đánh giá</button>
        </div>
      ) : (
        <form className={styles.formReview} onSubmit={handleSubmit}>
          <h3 className={styles.formTitle}>Viết đánh giá của bạn</h3>

          <div className={styles.starSelect}>
            <label>Chọn số sao</label>

            <select
              className={styles.select}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={5}>⭐⭐⭐⭐⭐ - Rất tốt</option>
              <option value={4}>⭐⭐⭐⭐ - Tốt</option>
              <option value={3}>⭐⭐⭐ - Bình thường</option>
              <option value={2}>⭐⭐ - Tệ</option>
              <option value={1}>⭐ - Rất tệ</option>
            </select>
          </div>

          <textarea
            className={styles.textarea}
            placeholder="Chia sẻ cảm nhận..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {submitError && (
            <p className={styles.empty} role="alert">
              {submitError}
            </p>
          )}

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            Gửi đánh giá
          </button>
        </form>
      )}

      {/* LIST */}
      <div className={styles.reviewList}>
        {filteredReviews.length === 0 ? (
          <div className={styles.empty}>Chưa có đánh giá nào.</div>
        ) : (
          visibleReviews.map((review, index) => (
            <div key={index} className={styles.reviewCard}>

              <div className={styles.reviewTop}>
                <div className={styles.reviewInfo}>
                  <div className={styles.avatar}>
                    {review.rate}★
                  </div>

                  <div>
                    <div className={styles.userRow}>
                      <h4 className={styles.userName}>
                        Khách hàng đã mua
                      </h4>
                      <span className={styles.badge}>Đã xác minh</span>
                    </div>

                    <div className={styles.stars}>
                      {renderStars(review.rate)}
                    </div>

                    <p className={styles.comment}>{review.content}</p>

                    <div className={styles.extraInfo}>
                      <span>
                        Đã mua: <strong>{review.quantity}</strong>{" "}
                        {review.unit}
                      </span>

                      <span>
                        Giá:{" "}
                        <strong>
                          {review.price
                            ? `${review.price.toLocaleString("vi-VN")}đ`
                            : "Không có dữ liệu"}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <span className={styles.date}>12/05/2026</span>
              </div>

              <div className={styles.actions}>
                <button className={styles.actionBtn}>
                  <ThumbsUp size={16} /> Hữu ích
                </button>
                <button className={styles.actionBtn}>
                  <MessageCircle size={16} /> Phản hồi
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* LOAD MORE */}
      {filteredReviews.length > 4 && (
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>

          {visibleCount < filteredReviews.length && (
            <button
              onClick={handleLoadMore}
              className={styles.submitBtn}
              style={{ width: 160 }}
            >
              Xem thêm
            </button>
          )}

          {visibleCount > 4 && (
            <button
              onClick={handleShowLess}
              className={styles.submitBtn}
              style={{ width: 160 }}
            >
              Ẩn bớt
            </button>
          )}

        </div>
      )}

    </section>
  );
};

export default Evaluate;
