import {
  BookOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import styles from "./EbookPage.module.css";

const EbookPage = () => {
  return (
    <section className={styles.wrapper}>
      {/* LEFT */}
      <div className={styles.content}>
        <div className={styles.badge}>
          <Sparkles size={16} />
          Nền tảng đọc sách hiện đại
        </div>

        <h1 className={styles.title}>
          Kho EBook Katiia
          <span>cao cấp sắp ra mắt</span>
        </h1>

        <p className={styles.description}>
          Trải nghiệm thư viện sách điện tử hiện đại với
          hàng ngàn đầu sách chất lượng, giao diện tối giản,
          đọc mượt mà và tối ưu cho mọi thiết bị.
        </p>

        <div className={styles.actions}>
          <button className={styles.primaryBtn}>
            Khám phá sau
            <ArrowRight size={18} />
          </button>

          <button className={styles.secondaryBtn}>
            Xem giới thiệu
          </button>
        </div>

        <div className={styles.stats}>
          <div>
            <h3>10K+</h3>
            <span>EBook</span>
          </div>

          <div>
            <h3>24/7</h3>
            <span>Đọc online</span>
          </div>

          <div>
            <h3>Premium</h3>
            <span>Trải nghiệm</span>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.visual}>
        <div className={styles.mainCard}>
          <div className={styles.bookCover}>
            <BookOpen size={90} />
          </div>

          <div className={styles.cardContent}>
            <span className={styles.category}>
              Công nghệ • Kinh doanh
            </span>

            <h2>
              Không gian đọc sách
              thế hệ mới
            </h2>

            <p>
              Tối ưu trải nghiệm đọc với giao diện
              hiện đại, tối giản và thư viện sách
              phong phú dành riêng cho bạn.
            </p>
          </div>
        </div>

        <div className={styles.floatingCard}>
          <span>COMING SOON</span>
        </div>
      </div>
    </section>
  );
};

export default EbookPage;