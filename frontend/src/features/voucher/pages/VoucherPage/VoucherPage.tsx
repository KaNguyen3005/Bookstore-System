import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Copy,
  Calendar,
  Clock3,
  Gift,
} from "lucide-react";

import { voucherService } from "../../../admin/voucherManagement/services/voucherService";
import type { Voucher } from "../../types/voucher";

import styles from "./VoucherPage.module.css";
import BannerVoucher from "../../components/BannerVoucher/BannerVoucher";
import TopSellingBooks from "../../../home/components/TopsellingBooks/TopSellingBooks";

import { useHomeData } from "../../../home/hooks/useHomeData";

//FORMAT CURRENCY
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN").format(amount) + "đ";

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  //  pagination UI state
  const [visibleCount, setVisibleCount] = useState(10);

  const navigate = useNavigate();

  //  scroll ref
  const voucherTopRef = useRef<HTMLDivElement | null>(null);

  //HOME DATA 
  const { homeData } = useHomeData();
  const topBooks = (homeData?.topSellingBooks || []).slice(0, 10);

  //  LOAD VOUCHERS 
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);

        const data = await voucherService.getActiveVouchers();

        setVouchers(data?.data ?? data ?? []);
      } catch (error) {
        console.error("Voucher fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  // FILTER 
  const filteredVouchers = useMemo(() => {
    return vouchers.filter(
      (v) =>
        v.code?.toLowerCase().includes(search.toLowerCase()) ||
        v.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [vouchers, search]);

  // visible list
  const visibleVouchers = filteredVouchers.slice(0, visibleCount);

  // COPY 
  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert(`Đã copy mã ${code}`);
    } catch (error) {
      console.error(error);
    }
  };

  // COLLECT 
  const handleCollect = (voucher: Voucher) => {
    console.log("Collect:", voucher);
    alert(`Đã thu thập voucher ${voucher.code}`);
  };

  //  FORMAT 
  const formatDiscount = (voucher: Voucher) => {
    switch (voucher.discountType) {
      case "percent":
        return `${voucher.value}%`;

      case "fixed":
        return formatCurrency(voucher.value);

      default:
        return "FREESHIP";
    }
  };

  //  TOGGLE LOAD MORE / HIDE 
  const handleToggle = () => {
    const isExpanded = visibleCount > 10;

    if (isExpanded) {
      //  Ẩn bớt
      setVisibleCount(8);

      //  scroll lên đầu voucher
      voucherTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      //  load thêm 4
      setVisibleCount((prev) => prev + 4);
    }
  };

  return (
    <div className={styles.page}>
      {/*   HEADER   */}
      <BannerVoucher />

      {/*   SEARCH   */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Tìm voucher..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(8); // reset khi search
            }}
          />
        </div>
      </div>

      {/*   LIST   */}
      <div ref={voucherTopRef} className={styles.grid}>
        {loading ? (
          <div className={styles.empty}>Đang tải voucher...</div>
        ) : visibleVouchers.length === 0 ? (
          <div className={styles.empty}>Không có voucher</div>
        ) : (
          visibleVouchers.map((voucher) => {
            const pct =
              voucher.usageLimit === 0
                ? 0
                : Math.min(
                    100,
                    Math.round(
                      (voucher.usedCount / voucher.usageLimit) * 100
                    )
                  );

            const headerModifier =
              voucher.discountType === "freeship"
                ? styles.freeship
                : voucher.discountType === "percent"
                ? styles.percent
                : styles.fixed;

            const badgeLabel =
              voucher.discountType === "freeship"
                ? "Miễn phí vận chuyển"
                : voucher.discountType === "percent"
                ? `Giảm ${voucher.value}%`
                : `Giảm ${formatCurrency(voucher.value)}`;

            return (
              <div key={voucher.id} className={styles.card}>
                <div className={`${styles.cardHeader} ${headerModifier}`}>
                  <div className={styles.titleArea}>
                    <div className={styles.badge}>{badgeLabel}</div>

                    <div className={styles.value}>
                      {formatDiscount(voucher)}
                    </div>

                    <div className={styles.minOrder}>
                      Đơn tối thiểu: {formatCurrency(voucher.minOrder)}
                    </div>
                  </div>

                  <button
                    className={styles.copyBtn}
                    onClick={() => handleCopy(voucher.code)}
                  >
                    <Copy size={15} />
                  </button>
                </div>

                <div className={styles.notch}>
                  <div className={styles.notchLine} />
                </div>

                <div className={styles.codeRow}>
                  <div>
                    <span className={styles.codeLabel}>
                      MÃ GIẢM GIÁ
                    </span>

                    <div className={styles.code}>{voucher.code}</div>
                  </div>

                  <div className={styles.expire}>
                    <Calendar size={13} />
                    {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
                  </div>
                </div>

                <div className={styles.body}>
                  <div className={styles.progressHead}>
                    <span>
                      Đã dùng {voucher.usedCount}/{voucher.usageLimit}
                    </span>
                    <span>{pct}%</span>
                  </div>

                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className={styles.bottom}>
                    <div className={styles.remain}>
                      <Clock3 size={14} />
                      Còn {voucher.usageLimit - voucher.usedCount} lượt
                    </div>

                    <button
                      className={styles.collectBtn}
                      onClick={() => handleCollect(voucher)}
                    >
                      <Gift size={15} />
                      Thu thập
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/*   LOAD MORE / HIDE BUTTON   */}
      {!loading && filteredVouchers.length > 8 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={handleToggle}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "black",
              color: "white",
              cursor: "pointer",
            }}
          >
            {visibleCount > 10 ? "Ẩn bớt" : "Xem thêm"}
          </button>
        </div>
      )}

      {/*   TOP SELLING   */}
      <div className={styles.topSection}>
        <TopSellingBooks books={topBooks} />

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer",
              background: "black",
              color: "white",
            }}
          >
            Xem thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherPage;