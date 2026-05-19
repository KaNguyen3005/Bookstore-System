import styles from "./helpPage.module.css";

export default function HelpPage() {
  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1 className={styles.title}>Trung tâm trợ giúp</h1>
        <p className={styles.subtitle}>
          Chúng tôi luôn sẵn sàng hỗ trợ bạn khi mua sách
        </p>
      </div>

      {/* SEARCH */}
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Tìm câu hỏi, ví dụ: thanh toán, giao hàng..."
          className={styles.searchInput}
        />
      </div>

      {/* CONTENT */}
      <div className={styles.grid}>
        {/* FAQ */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Câu hỏi thường gặp</h2>

          <div className={styles.faqItem}>
            <h3>Tôi đặt sách bao lâu thì nhận được?</h3>
            <p>Thường từ 2 - 5 ngày tùy khu vực.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>Tôi có thể đổi/trả sách không?</h3>
            <p>Có, trong vòng 7 ngày nếu sách lỗi hoặc hư hỏng.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>Thanh toán có an toàn không?</h3>
            <p>Chúng tôi hỗ trợ COD và thanh toán online bảo mật.</p>
          </div>
        </div>

        {/* CONTACT */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Liên hệ hỗ trợ</h2>

          <p className={styles.info}>
            Hotline: <b>1900 999 999</b>
          </p>

          <p className={styles.info}>
            Email: <b>support@bookstore.com</b>
          </p>
           <p className={styles.info}>
            Zalo: <b>912345678</b>
          </p>
          <p className={styles.info}>
            Thời gian: 8:00 - 22:00 mỗi ngày
          </p>

        </div>
      </div>
    </div>
  );
}