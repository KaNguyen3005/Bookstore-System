import {
  Gift,
  Sparkles,
  TicketPercent,
} from "lucide-react";

import styles from "./BannerVoucher.module.css";

const BannerVoucher = () => {
  return (
    <section className={styles.banner}>
      {/* LEFT */}
      <div className={styles.content}>
        <div className={styles.badge}>
          <Sparkles size={16} />
          Ưu đãi giới hạn hôm nay
        </div>

        <h1 className={styles.title}>
          Mã giảm giá
          <span> siêu hot cho bạn</span>
        </h1>

        <p className={styles.description}>
          Khám phá hàng loạt voucher hấp dẫn với ưu đãi cực sốc.
          Chỉ cần sao chép mã và sử dụng ngay khi thanh toán để
          tiết kiệm nhiều hơn cho đơn hàng của bạn.
        </p>

        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
          >
            <Gift size={18} />
            Mua sắm ngay
          </button>

          <button
            className={
              styles.secondaryBtn
            }
          >
            <TicketPercent size={18} />
            Xem tất cả ưu đãi
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.visual}>
        <div
          className={`${styles.card} ${styles.blue}`}
        >
          <span>SALE</span>
          <h2>50%</h2>
        </div>

        <div
          className={`${styles.card} ${styles.orange}`}
        >
          <span>FREESHIP</span>
          <h2>0đ</h2>
        </div>

        <div
          className={`${styles.card} ${styles.green}`}
        >
          <span>VIP</span>
          <h2>MEMBER</h2>
        </div>
      </div>
    </section>
  );
};

export default BannerVoucher;