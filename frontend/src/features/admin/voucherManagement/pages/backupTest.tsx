/*
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Ticket, Trash2, Pencil } from "lucide-react";

import { voucherService } from "../../../admin/voucherManagement/services/voucherService";

import type { Voucher } from "../../types/voucher";

import styles from "./VoucherPage.module.css";

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ================= LOAD =================
  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);

      const data = await voucherService.getVouchers();

      setVouchers(data);
    } catch (error) {
      console.error("Voucher fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTER =================
  const filteredVouchers = useMemo(() => {
    return vouchers.filter(
      (v) =>
        v.code.toLowerCase().includes(search.toLowerCase()) ||
        v.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [vouchers, search]);

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xoá voucher này?",
    );

    if (!confirmDelete) return;

    try {
      await voucherService.deleteVoucher(id);

      setVouchers((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Delete voucher error:", error);
    }
  };

  // ================= FORMAT =================
  const formatDiscount = (voucher: Voucher) => {
    switch (voucher.discountType) {
      case "percent":
        return `${voucher.value}%`;

      case "fixed":
        return `${voucher.value.toLocaleString()}đ`;

      default:
        return "Freeship";
    }
  };

  return (
    <div className={styles.page}>
      {/* ================= HEADER ================= */}
      <div className={styles.header}>
        <div>
          <h1>Quản lý Voucher</h1>
          <p>Danh sách voucher khuyến mãi</p>
        </div>

        <button className={styles.createBtn}>
          <Plus size={18} />
          Tạo Voucher
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />

          <input
            type="text"
            placeholder="Tìm voucher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Voucher</th>
              <th>Giảm giá</th>
              <th>Điều kiện</th>
              <th>Đã dùng</th>
              <th>Trạng thái</th>
              <th>Hết hạn</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  Đang tải...
                </td>
              </tr>
            ) : filteredVouchers.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  Không có voucher
                </td>
              </tr>
            ) : (
              filteredVouchers.map((voucher) => (
                <tr key={voucher.id}>
                  <td>
                    <div className={styles.voucherInfo}>
                      <div className={styles.voucherIcon}>
                        <Ticket size={18} />
                      </div>

                      <div>
                        <h4>{voucher.code}</h4>

                        <p>{voucher.title}</p>
                      </div>
                    </div>
                  </td>

                  <td className={styles.discount}>
                    {formatDiscount(voucher)}
                  </td>

                  <td>
                    {voucher.minOrder
                      ? `${voucher.minOrder.toLocaleString()}đ`
                      : "-"}
                  </td>

                  <td>
                    {voucher.usedCount}/{voucher.usageLimit}
                  </td>

                  <td>
                    <span
                      className={`${styles.status} ${
                        voucher.status === "active"
                          ? styles.active
                          : styles.inactive
                      }`}
                    >
                      {voucher.status === "active"
                        ? "Hoạt động"
                        : "Tạm dừng"}
                    </span>
                  </td>

                  <td>
                    {new Date(voucher.endDate).toLocaleDateString(
                      "vi-VN",
                    )}
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn}>
                        <Pencil size={16} />
                      </button>

                      <button
                        className={styles.deleteBtn}
                        onClick={() =>
                          handleDelete(voucher.id)
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VoucherPage;
*/