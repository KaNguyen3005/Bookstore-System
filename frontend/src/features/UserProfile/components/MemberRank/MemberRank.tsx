import styles from "./MemberRank.module.css";

export default function MemberRank() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.badge}>COMING SOON</div>

        <h2 className={styles.title}>Chức năng tích điểm</h2>

        <p className={styles.desc}>
          Hệ thống hạng thành viên đang được phát triển.
          Bạn sẽ sớm có thể tích điểm, nâng hạng và nhận ưu đãi hấp dẫn.
        </p>

        <div className={styles.status}>
          Tính năng sẽ ra mắt trong thời gian tới
        </div>
      </div>
    </div>
  );
}