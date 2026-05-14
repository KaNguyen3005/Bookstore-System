import styles from "./CommunityPage.module.css";
import { Users } from "lucide-react";

const CommunityPage = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <Users size={50} />
        </div>

        <span className={styles.badge}>COMING SOON</span>

        <h1>Cộng đồng KatiIa sắp ra mắt</h1>

        <p>
          Nơi kết nối những người yêu sách, chia sẻ kiến thức và cùng nhau
          phát triển mỗi ngày.
        </p>
      </div>
    </section>
  );
};

export default CommunityPage;