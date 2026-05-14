import styles from "./BlogPage.module.css";
import { PenSquare } from "lucide-react";

const BlogPage = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <PenSquare size={50} />
        </div>

        <span className={styles.badge}>COMING SOON</span>

        <h1>Blog đang được phát triển</h1>

        <p>
          KatiIa Blog sẽ sớm ra mắt với nhiều bài viết về sách, công nghệ,
          AI và kỹ năng phát triển bản thân.
        </p>
      </div>
    </section>
  );
};

export default BlogPage;