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
          Voucher độc quyền
        </div>

        <h1 className={styles.title}>
          Săn voucher
          <span> giảm giá cực hot</span>
        </h1>

        <p className={styles.description}>
          Thu thập voucher freeship,
          giảm giá và ưu đãi thành viên
          dành riêng cho bạn.
        </p>

        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
          >
            <Gift size={18} />
            Thu thập ngay
          </button>

          <button
            className={
              styles.secondaryBtn
            }
          >
            <TicketPercent size={18} />
            Xem ưu đãi
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