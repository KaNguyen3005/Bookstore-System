import styles from "./CompaniesPage.module.css";

import {
  Building2, BookOpen, MapPin, Target, Sparkles,
  Zap, ShieldCheck, HeartHandshake, Quote
} from "lucide-react";

const branches = [
  { city: "TP. Hồ Chí Minh", detail: "Trung tâm trải nghiệm sách công nghệ cao tại Quận 1." },
  { city: "Hà Nội", detail: "Không gian đọc sách yên tĩnh tại trung tâm văn hóa." },
  { city: "Đà Nẵng", detail: "Thiết kế mở, view biển, kết hợp cafe sách." },
  { city: "Cần Thơ", detail: "Điểm đến văn hóa cho giới trẻ miền Tây." },
];

const CompaniesPage = () => {
  return (
    <section className={styles.wrapper}>
      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <span className={styles.badge}>
            <Building2 size={16} /> KATIIA BOOKSTORE
          </span>
          <h1>Hệ thống bán sách hiện đại dành cho thế hệ trẻ</h1>
          <p>Katiia kết hợp tri thức truyền thống với công nghệ AI đột phá, mang đến hành trình khám phá tri thức cá nhân hóa cho từng độc giả.</p>
        </div>
      </div>

      {/* ABOUT */}
      <div className={styles.about}>
        <div className={styles.left}>
          <h2>Về KATIIA</h2>
          <p>Được thành lập từ năm 2022, Katiia khởi đầu với khát vọng xóa bỏ khoảng cách giữa người đọc và kho tàng tri thức khổng lồ thông qua công nghệ.</p>
          <p>Chúng tôi sở hữu nền tảng <strong>Katiia AI Recommendation</strong>, giúp phân tích sở thích đọc để gợi ý chính xác những tựa sách bạn cần ngay khi vừa bước chân vào cửa hàng.</p>
        </div>
        <div className={styles.right}>
          <div className={styles.infoCard}>
            <BookOpen size={40} color="#325863" />
            <h3>10.000+</h3>
            <span>Đầu sách bản quyền từ các NXB lớn</span>
          </div>
          <div className={styles.infoCard}>
            <Sparkles size={40} color="#325863" />
            <h3>50.000+</h3>
            <span>Độc giả sử dụng nền tảng AI mỗi tháng</span>
          </div>
        </div>
      </div>

      {/* MISSION - Mới */}
      <div className={styles.missionSection}>
        <div className={styles.missionContainer}>
          <Target size={48} style={{ marginBottom: '20px' }} />
          <h2>Sứ mệnh & Tầm nhìn</h2>
          <p>
            Trở thành hệ sinh thái sách hàng đầu Việt Nam, nơi công nghệ phục vụ giáo dục.
            Chúng tôi cam kết thúc đẩy văn hóa đọc bền vững thông qua việc cá nhân hóa trải nghiệm,
            giúp mỗi cá nhân tìm thấy người bạn đồng hành qua từng trang sách.
          </p>
        </div>
      </div>


      {/* NEW: FEATURES - Lợi ích vượt trội */}
            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <Zap size={30} color="#325863" />
                <h3>Tốc độ & Tiện lợi</h3>
                <p>Đặt sách online, nhận sách trong 2h tại khu vực nội thành.</p>
              </div>
              <div className={styles.featureItem}>
                <ShieldCheck size={30} color="#325863" />
                <h3>Sách chính hãng</h3>
                <p>Cam kết 100% sách bản quyền từ các NXB uy tín nhất.</p>
              </div>
              <div className={styles.featureItem}>
                <HeartHandshake size={30} color="#325863" />
                <h3>Cộng đồng đọc</h3>
                <p>Tham gia CLB đọc sách Katiia với hàng ngàn thành viên.</p>
              </div>
            </div>

            {/* NEW: TESTIMONIAL - Cảm nhận khách hàng */}
            <div className={styles.testimonialSection}>
              <Quote size={40} color="#325863" />
              <div className={styles.testimonialCard}>
                "Katiia không chỉ là tiệm sách, đó là nơi mình tìm thấy sự kết nối.
                Công cụ gợi ý sách của họ cực kỳ chính xác với gu của mình!"
                <p style={{ marginTop: '15px', fontWeight: 'bold' }}>— Nguyễn Văn A, Tech Enthusiast</p>
              </div>
            </div>

      {/* BRANCHES */}
      <div className={styles.branchSection}>
        <h2>Chi nhánh nổi bật</h2>
        <div className={styles.branchGrid}>
          {branches.map((item, index) => (
            <div key={index} className={styles.branchCard}>
              <MapPin size={24} color="#325863" />
              <h3>{item.city}</h3>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompaniesPage;