import styles from "./memberPage.module.css";
import { Star, Crown, Gem } from "lucide-react";

import { MdLocalShipping } from "react-icons/md";
import { BsGiftFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";

const MemberPage = () => {
  return (
    <section className={styles.wrapper}>

      {/*   HERO   */}
      <div className={styles.hero}>
        <h1>Chương trình thành viên Katiia</h1>

        <p>
          Tích điểm – nâng hạng – nhận ưu đãi độc quyền dành cho
          khách hàng thân thiết của nhà sách Katila.
        </p>
      </div>

      {/*   BENEFITS   */}
      <div className={styles.benefitIntro}>
        <h2>Lợi ích khi trở thành thành viên</h2>

        <div className={styles.benefitGrid}>
          <div className={styles.benefitCard}>
            <BsGiftFill /> Giảm giá độc quyền theo hạng thành viên
          </div>

          <div className={styles.benefitCard}>
            <FaStar /> Tích điểm đổi quà mỗi đơn hàng
          </div>

          <div className={styles.benefitCard}>
            <MdLocalShipping /> Miễn phí vận chuyển theo cấp độ
          </div>

          <div className={styles.benefitCard}>
             Ưu tiên sách mới & bản đặc biệt
          </div>
        </div>
      </div>

      {/*   TIERS   */}
      <div className={styles.tierSection}>

        {/* SILVER */}
        <div className={styles.card}>
          <Star size={28} />
          <h3>Silver</h3>
          <p>Khách hàng mới</p>

          <ul>
            <li>Giảm 5% tất cả sản phẩm</li>
            <li>Tích điểm cơ bản</li>
            <li>Ưu đãi sinh nhật</li>
          </ul>
        </div>

        {/* GOLD */}
        <div className={`${styles.card} ${styles.gold}`}>
          <Crown size={28} />
          <h3>Gold</h3>
          <p>Khách hàng thân thiết</p>

          <ul>
            <li>Giảm 10% toàn bộ đơn hàng</li>
            <li>Miễn phí vận chuyển</li>
            <li>Ưu tiên pre-order sách mới</li>
          </ul>
        </div>

        {/* DIAMOND */}
        <div className={`${styles.card} ${styles.diamond}`}>
          <Gem size={28} />
          <h3>Diamond</h3>
          <p>Khách hàng VIP</p>

          <ul>
            <li>Giảm 15–20% toàn bộ sản phẩm</li>
            <li>Miễn phí ship toàn quốc</li>
            <li>Quà tặng đặc biệt hàng tháng</li>
          </ul>
        </div>

      </div>

    </section>
  );
};

export default MemberPage;
