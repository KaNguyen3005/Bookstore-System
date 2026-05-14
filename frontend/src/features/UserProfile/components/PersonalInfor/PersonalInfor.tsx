import { useState } from "react";
import styles from "./PersonalInfor.module.css";

export default function PersonalInfor() {
  const [form, setForm] = useState({
    companyName: "",
    companyTaxCode: "",
    email: "",
    address: "",
    personalTaxCode: "",
    cccd: "",
  });

  const [editCompany, setEditCompany] = useState(false);
  const [editPersonal, setEditPersonal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const InputRow = ({ label, name, value, placeholder, disabled }) => (
    <div className={styles.row}>
      <label>{label}</label>
      <input
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );

  return (
    <div className={styles.profileWrapper}>
      <h2 className={styles.title}>Thông tin tài khoản</h2>
      <p className={styles.subTitle}>
        Chỉnh sửa theo từng phần
      </p>

      {/* ================= COMPANY ================= */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.sectionTitle}>
            Thông tin xuất hóa đơn
          </div>

          <button
            className={styles.btn}
            onClick={() => setEditCompany(!editCompany)}
          >
            {editCompany ? "Lưu" : "Sửa"}
          </button>
        </div>

        <InputRow
          label="Tên công ty"
          name="companyName"
          value={form.companyName}
          placeholder="Công ty TNHH ABC"
          disabled={!editCompany}
        />

        <InputRow
          label="Mã số thuế công ty"
          name="companyTaxCode"
          value={form.companyTaxCode}
          placeholder="0123456789"
          disabled={!editCompany}
        />

        <InputRow
          label="Email"
          name="email"
          value={form.email}
          placeholder="company@gmail.com"
          disabled={!editCompany}
        />

        <InputRow
          label="Địa chỉ"
          name="address"
          value={form.address}
          placeholder="Số nhà, đường, quận..."
          disabled={!editCompany}
        />
      </div>

      {/* ================= PERSONAL ================= */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.sectionTitle}>
            Thông tin cá nhân
          </div>

          <button
            className={styles.btn}
            onClick={() => setEditPersonal(!editPersonal)}
          >
            {editPersonal ? "Lưu" : "Sửa"}
          </button>
        </div>

        <InputRow
          label="Mã số thuế cá nhân"
          name="personalTaxCode"
          value={form.personalTaxCode}
          placeholder="MST cá nhân"
          disabled={!editPersonal}
        />

        <InputRow
          label="Số CCCD"
          name="cccd"
          value={form.cccd}
          placeholder="Số CCCD/CMND"
          disabled={!editPersonal}
        />
      </div>
    </div>
  );
}