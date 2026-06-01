import styles from "./AIInsightCard.module.css";

type Props = {
  avg: number;
  status: string;
};

export default function AIInsightCard({ avg, status }: Props) {
  return (
    <div className={styles.panel}>
      <h3 className={styles.aiTitle}>
        AI Insight

        <a
          href="https://icons8.com/icon/TH3ppfhFp3TG/robot"
          target="_blank"
          rel="noreferrer"
          className={styles.robotLink}
        >
          <img
            src="https://img.icons8.com/fluency/48/robot-2.png"
            alt="AI Robot"
            className={styles.robotIcon}
          />
        </a>
      </h3>

      <p>
        Giá trị đơn trung bình:
        <b> {avg.toLocaleString()} đ</b>
      </p>

      <p>
        Phân tích:
        <b> {status}</b>
      </p>
    </div>
  );
}