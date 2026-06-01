import {
  Award,
  CalendarDays,
  Mail,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
  VenusAndMars,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";

import { type UserFE } from "../../../../../services/userApi";

type Props = {
  user: UserFE;
  onClose: () => void;
};

const splitName = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  return {
    firstPart: parts[0] ?? "",
    rest: parts.slice(1).join(" "),
  };
};

const genderLabel: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

const formatDob = (dob?: Date | string | null) => {
  if (!dob) return "Chưa cập nhật";

  const parsedDate = typeof dob === "string" ? new Date(dob) : dob;

  if (Number.isNaN(parsedDate.getTime())) {
    return "Chưa cập nhật";
  }

  return new Intl.DateTimeFormat("vi-VN").format(parsedDate);
};

export default function UserDetail({ user, onClose }: Props) {
  const modalRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lastTouchY = useRef(0);
  const nameParts = splitName(user.name || "");
  const displayName = user.name || user.username || "Người dùng";
  const formattedDob = formatDob(user.dob);

  useEffect(() => {
    const scrollY = window.scrollY;
    const previousBodyStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overscrollBehavior: document.body.style.overscrollBehavior,
    };
    const previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    const isAtTop = (element: HTMLElement) => element.scrollTop <= 0;
    const isAtBottom = (element: HTMLElement) =>
      Math.ceil(element.scrollTop + element.clientHeight) >=
      element.scrollHeight;

    const handleWheel = (event: WheelEvent) => {
      const modal = modalRef.current;
      const scrollArea = scrollRef.current;

      if (!modal || !scrollArea || !modal.contains(event.target as Node)) {
        event.preventDefault();
        return;
      }

      if (
        (isAtTop(scrollArea) && event.deltaY < 0) ||
        (isAtBottom(scrollArea) && event.deltaY > 0)
      ) {
        scrollArea.scrollTop =
          event.deltaY < 0
            ? 0
            : scrollArea.scrollHeight - scrollArea.clientHeight;
        event.preventDefault();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      lastTouchY.current = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const modal = modalRef.current;
      const scrollArea = scrollRef.current;
      const currentY = event.touches[0]?.clientY ?? 0;
      const deltaY = currentY - lastTouchY.current;

      lastTouchY.current = currentY;

      if (!modal || !scrollArea || !modal.contains(event.target as Node)) {
        event.preventDefault();
        return;
      }

      if (
        (isAtTop(scrollArea) && deltaY > 0) ||
        (isAtBottom(scrollArea) && deltaY < 0)
      ) {
        scrollArea.scrollTop =
          deltaY > 0
            ? 0
            : scrollArea.scrollHeight - scrollArea.clientHeight;
        event.preventDefault();
      }
    };

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.body.style.overflow = previousBodyStyle.overflow;
      document.body.style.position = previousBodyStyle.position;
      document.body.style.top = previousBodyStyle.top;
      document.body.style.width = previousBodyStyle.width;
      document.body.style.overscrollBehavior =
        previousBodyStyle.overscrollBehavior;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <section
        ref={modalRef}
        className="modal user-detail-modal"
        onClick={(event) => event.stopPropagation()}
        aria-label="Chi tiết người dùng"
      >
        <header className="user-detail-header">
          <div className="user-detail-header-main">
            <div className="user-detail-avatar">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={displayName} />
              ) : (
                <UserRound size={34} />
              )}
            </div>

            <div className="user-detail-title">
              <span>Hồ sơ khách hàng</span>
              <h3>{displayName}</h3>
              <p>{user.username || "Chưa cập nhật tên đăng nhập"}</p>
            </div>
          </div>

          <div className="user-detail-header-meta">
            <span className="user-detail-id">ID #{user.userId}</span>
            <div className="user-detail-badges">
              <span
                className={
                  user.status ? "status-badge active" : "status-badge inactive"
                }
              >
                {user.status ? "Hoạt động" : "Ngừng hoạt động"}
              </span>
              <span className="role-badge">
                <ShieldCheck size={15} />
                {user.role || "CUSTOMER"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="user-detail-close"
            onClick={onClose}
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </header>

        <div className="user-detail-body" ref={scrollRef}>
          <section className="user-detail-section">
            <h4>Thông tin liên hệ</h4>
            <div className="user-detail-grid">
              <div className="user-detail-item">
                <Mail size={18} />
                <div>
                  <span>Email</span>
                  <strong>{user.email || "Chưa cập nhật"}</strong>
                </div>
              </div>

              <div className="user-detail-item">
                <Phone size={18} />
                <div>
                  <span>Số điện thoại</span>
                  <strong>{user.phone || "Chưa cập nhật"}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="user-detail-section">
            <h4>Hồ sơ cá nhân</h4>
            <div className="user-detail-grid">
              <div className="user-detail-item">
                <UserRound size={18} />
                <div>
                  <span>Họ</span>
                  <strong>{nameParts.firstPart || "Chưa cập nhật"}</strong>
                </div>
              </div>

              <div className="user-detail-item">
                <UserRound size={18} />
                <div>
                  <span>Tên</span>
                  <strong>{nameParts.rest || "Chưa cập nhật"}</strong>
                </div>
              </div>

              <div className="user-detail-item">
                <VenusAndMars size={18} />
                <div>
                  <span>Giới tính</span>
                  <strong>{genderLabel[user.gender] || user.gender || "Chưa cập nhật"}</strong>
                </div>
              </div>

              <div className="user-detail-item">
                <CalendarDays size={18} />
                <div>
                  <span>Ngày sinh</span>
                  <strong>{formattedDob}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="user-detail-section">
            <h4>Thành viên</h4>
            <div className="user-detail-grid">
              <div className="user-detail-item">
                <Award size={18} />
                <div>
                  <span>Hạng hiện tại</span>
                  <strong>{user.tier || "BRONZE"}</strong>
                </div>
              </div>

              <div className="user-detail-item highlight">
                <Star size={18} />
                <div>
                  <span>Điểm tích lũy</span>
                  <strong>{user.point ?? 0}</strong>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="user-detail-actions">
          <div>
            <span>Tài khoản</span>
            <strong>#{user.userId}</strong>
          </div>

          <button type="button" onClick={onClose}>
            Đóng
          </button>
        </footer>
      </section>
    </div>
  );
}
