import styles from "./CompaniesPage.module.css";
import {
  Building2,
  BookOpen,
  MapPin,
} from "lucide-react";

const branches = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Cần Thơ",
];

const CompaniesPage = () => {
  return (
    <section className={styles.wrapper}>
      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.overlay}></div>

        <div className={styles.heroContent}>
          <span className={styles.badge}>
            <Building2 size={16} />
            KATIIA BOOKSTORE
          </span>

          <h1>
            Hệ thống bán sách hiện đại dành cho thế hệ trẻ
          </h1>

          <p>
            Katiia là thương hiệu bán sách kết hợp công nghệ,
            AI và trải nghiệm đọc hiện đại nhằm mang tri thức
            đến gần hơn với mọi người.
          </p>
        </div>
      </div>

      {/* ABOUT */}
      <div className={styles.about}>
        <div className={styles.left}>
          <h2>Về KATIIA</h2>

          <p>
            Katiia được thành lập với sứ mệnh xây dựng hệ sinh
            thái đọc sách hiện đại, nơi người dùng có thể tìm
            thấy tri thức, cảm hứng và cộng đồng yêu sách.
          </p>

          <p>
            Chúng tôi không chỉ bán sách mà còn phát triển
            nền tảng AI gợi ý sách thông minh dành cho người dùng.
          </p>
        </div>

        <div className={styles.right}>
          <div className={styles.infoCard}>
            <BookOpen size={40} />

            <h3>10.000+</h3>

            <span>Đầu sách đa dạng</span>
          </div>

          <div className={styles.infoCard}>
            <MapPin size={40} />

            <h3>4+</h3>

            <span>Chi nhánh toàn quốc</span>
          </div>
        </div>
      </div>

      {/* BRANCHES */}
      <div className={styles.branchSection}>
        <h2>Chi nhánh nổi bật</h2>

        <div className={styles.branchGrid}>
          {branches.map((item, index) => (
            <div key={index} className={styles.branchCard}>
              <MapPin size={24} />

              <h3>{item}</h3>

              <p>
                Không gian hiện đại dành cho cộng đồng yêu sách.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompaniesPage;