import styles from "../ProfileContent.module.css";

type Props = {
  user: any;
};

export default function MemberInfo({ user }: Props) {
  return (
    <div className={styles.member}>
      <h3 className={styles.memberTitle}>Hạng thành viên</h3>

      <div className={styles.memberItem}>
        <span>Hạng:</span>
        <b>{user.tier || "BRONZE"}</b>
      </div>

      <div className={styles.memberItem}>
        <span>Điểm:</span>
        <b>{user.point || 0}</b>
      </div>
    </div>
  );
}