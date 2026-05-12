import styles from "./Notification.module.css";
import { FaBell, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";

const notifications = [
  {
    id: 1,
    message: "Đơn hàng #BS1023 của bạn đã được xác nhận.",
    time: "12/05/2026 - 09:30",
    read: true,
  },
  {
    id: 2,
    message: "Sách mới thể loại Fantasy vừa được cập nhật.",
    time: "11/05/2026 - 18:20",
    read: false,
  },
  {
    id: 3,
    message: "Bạn nhận được voucher giảm 20%.",
    time: "10/05/2026 - 14:10",
    read: false,
  },
];

export default function Notification() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.bellButton}
        onClick={() => setOpen(!open)}
      >
        <FaBell />
        <span className={styles.badge}>
          {notifications.filter((n) => !n.read).length}
        </span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h4>Thông báo</h4>
          </div>

          <div className={styles.list}>
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`${styles.item} ${
                  item.read ? styles.read : styles.unread
                }`}
              >
                <div className={styles.content}>
                  <p>{item.message}</p>
                  <span>{item.time}</span>
                </div>

                {item.read && (
                  <FaCheckCircle className={styles.check} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}