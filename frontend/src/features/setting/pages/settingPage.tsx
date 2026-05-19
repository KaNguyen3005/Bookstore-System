import styles from "./settingPage.module.css";

export default function SettingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Settings</h1>

        <p className={styles.subtitle}>
          Các tính năng đang được phát triển và sẽ ra mắt sớm
        </p>

        <ul className={styles.list}>
          <li>Đổi mật khẩu nâng cao</li>
          <li>Cài đặt thông báo</li>
          <li>Dark / Light mode</li>
          <li>Ngôn ngữ</li>
          <li>Quản lý tài khoản</li>
        </ul>

        <div className={styles.badge}>
          Coming Soon...
        </div>
      </div>
    </div>
  );
}