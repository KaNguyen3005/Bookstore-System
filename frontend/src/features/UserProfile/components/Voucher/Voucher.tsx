import styles from "./Voucher.module.css";

export default function Voucher() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.badge}>COMING SOON</div>

        <h2 className={styles.title}>Voucher đã lưu</h2>

        <p className={styles.desc}>
          Tính năng lưu và quản lý voucher đang được phát triển.
          Bạn sẽ sớm có thể lưu mã giảm giá và sử dụng dễ dàng hơn.
        </p>

        <div className={styles.status}>
           Chức năng sẽ ra mắt trong thời gian tới
        </div>
      </div>
    </div>
  );
}