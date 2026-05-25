import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyOrders, cancelOrder  } from "../../../../services/orderApi";
import { useAuth } from "../../../../features/auth/hooks/useAuth";

import styles from "./PurchaseOrder.module.css";
import OrderModal from "../OrderModal/OrderModal";
import ReviewFormModal from "../ReviewFormModal/ReviewFormModal";

import ReviewModal from "../ReviewModal/reviewModal";

const getOrderItemCoverImage = (item: any) =>
  item?.coverImage ||
  item?.coverImageUrl ||
  item?.coverImgUrl ||
  item?.book?.coverImage ||
  item?.book?.coverImageUrl ||
  item?.book?.coverImgUrl ||
  item?.image;

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [active, setActive] = useState("ALL");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [reviewOrder, setReviewOrder] = useState<any | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [openReviewForm, setOpenReviewForm] = useState(false);

  const tabs = [
    { key: "ALL", label: "Tất cả" },
    { key: "PENDING", label: "Chờ xác nhận" },
    { key: "PICKING_UP", label: "Chờ lấy hàng" },
    { key: "SHIPPING", label: "Chờ giao hàng" },
    { key: "DELIVERED", label: "Đã giao" },
    { key: "RETURNED", label: "Trả hàng" },
    { key: "CANCELLED", label: "Đã hủy" },
  ];

  const statusMap: Record<string, string> = {
    CREATED: "Chờ xác nhận",
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Chờ lấy hàng",
    PICKING_UP: "Chờ lấy hàng",
    PROCESSING: "Chờ lấy hàng",
    PENDING_PAYMENT: "Chờ thanh toán",
    PAID: "Đã thanh toán",
    SHIPPING: "Đang giao hàng",
    COMPLETED: "Đã giao",
    DELIVERED: "Đã giao",
    REFUNDED: "Đã hoàn tiền",
    FAILED: "Thanh toán thất bại",
    RETURNED: "Trả hàng",
    CANCELLED: "Đã hủy",
    UNKNOWN: "Đang cập nhật",
  };

  const statusGroups: Record<string, string[]> = {
    PENDING: ["CREATED", "PENDING", "PENDING_PAYMENT"],
    PICKING_UP: ["CONFIRMED", "PROCESSING", "PICKING_UP", "PAID"],
    SHIPPING: ["SHIPPING"],
    DELIVERED: ["DELIVERED", "COMPLETED"],
    RETURNED: ["RETURNED", "REFUNDED", "FAILED"],
    CANCELLED: ["CANCELLED"],
  };

  // ================= LOAD ORDERS =================
const loadOrders = async () => {
  try {
    setLoading(true);

    const res = await getMyOrders();

    console.log("RAW API:", res);

    let nextOrders: any[] = [];

    if (Array.isArray(res)) {
      nextOrders = res;
    }
    else if (Array.isArray(res?.result?.content)) {
      nextOrders = res.result.content;
    }
    else if (Array.isArray(res?.result)) {
      nextOrders = res.result;
    }
    else if (Array.isArray(res?.data)) {
      nextOrders = res.data;
    }
    else if (Array.isArray(res?.content)) {
      nextOrders = res.content;
    }

    console.log("NEXT ORDERS:", nextOrders);

    setOrders(nextOrders);
  } catch (error) {
    console.error("Load orders failed:", error);
    setOrders([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem("access_token"));
    if (!isAuthenticated && !hasToken) return;

    loadOrders();
  }, [isAuthenticated]);

  // ================= ACTIONS =================
  const renderActions = (order: any) => {
    const status = order.status;

    switch (status) {
      case "PENDING":
      case "CREATED":
      case "PENDING_PAYMENT":
        return (
          <>
            <button
              className={styles.cancelBtn}
              onClick={() => {
                if (confirm("Bạn có chắc muốn hủy đơn này không?")) {
                  handleCancelOrder(order.orderId);
                }
              }}
            >
              Hủy đơn
            </button>

            <button onClick={() => navigate("/help")}>
              Liên hệ
            </button>
            <button onClick={() => setSelectedOrder(order)}>
              Xem chi tiết
            </button>
          </>
        );

      case "PICKING_UP":
      case "CONFIRMED":
      case "PROCESSING":
      case "PAID":
      case "SHIPPING":
        return (
          <>
            <button onClick={() => navigate("/help")}>
              Liên hệ
            </button>
            <button onClick={() => setSelectedOrder(order)}>
              Xem chi tiết
            </button>
          </>
        );

      case "DELIVERED":
      case "COMPLETED":
        return (
          <>
            <button onClick={() => setReviewOrder(order)}>
                 Đánh giá sản phẩm
            </button>

            {/*}<button>Mua lại</button>*/}
            <button onClick={() => navigate("/help")}>
              Liên hệ
            </button>
            <button onClick={() => setSelectedOrder(order)}>
              Xem chi tiết
            </button>
          </>
        );

      default:
        return (
           <>
              <button onClick={() => setSelectedOrder(order)}>
                Xem chi tiết
              </button>

              <button onClick={() => navigate("/help")}>
                Liên hệ
              </button>
           </>
        );
    }
  };

  // ================= FILTER =================
  const filteredOrders = useMemo(() => {
    if (active === "ALL") return orders;

    const group = statusGroups[active] || [active];

    return orders.filter((o) => group.includes(o.status));
  }, [orders, active]);

    //Xu ly dơn hang ( huy don)
    const handleCancelOrder = async (id: number) => {
      try {
        await cancelOrder(id);

        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === id
              ? { ...o, status: "CANCELLED" }
              : o
          )
        );

        // tự chuyển sang tab Đã hủy
        setActive("CANCELLED");
      } catch (error) {
        console.error("Cancel order failed:", error);
      }
    };

  // ================= UI =================
  return (
    <>
      <div className={styles.orderPage}>
        <div className={styles.orderHeader}>
          <h3>Đơn mua</h3>

          <div className={styles.orderTabs}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tab} ${
                  active === tab.key ? styles.active : ""
                }`}
                onClick={() => setActive(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.orderBox}>
          {loading ? (
            <p className={styles.emptyOrder}>Đang tải đơn hàng...</p>
          ) : filteredOrders.length === 0 ? (
            <div className={styles.emptyOrder}>
              <p>Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className={styles.orderList}>
              {filteredOrders.map((o, index) => {
                const firstItem = o.items?.[0];


                const orderImage = getOrderItemCoverImage(firstItem);

                const orderTitle =
                  firstItem?.bookTitle ||
                  `Đơn hàng #${o.orderId || index + 1}`;

                return (
                  <div key={o.orderId || index} className={styles.orderItem}>
                    <span
                      className={`${styles.shippingStatus} ${
                        o.status === "SHIPPING"
                          ? styles.blue
                          : o.status === "CANCELLED"
                          ? styles.red
                          : o.status === "DELIVERED" ||
                            o.status === "COMPLETED"
                          ? styles.green
                          : ""
                      }`}
                    >
                      Trạng thái: {statusMap[o.status] || o.status}
                    </span>

                    <div className={styles.orderTop}>
                      {orderImage && <img src={orderImage} alt={orderTitle} />}

                      <div className={styles.orderInfo}>
                        <h4>{orderTitle}</h4>

                        {firstItem ? (
                          o.items.length > 1 ? (
                            <span>
                              Số lượng: {firstItem.quantity} (+{" "}
                              {o.items.length - 1} sản phẩm khác)
                            </span>
                          ) : (
                            <span>
                              Số lượng: {firstItem.quantity}
                            </span>
                          )
                        ) : (
                          <span>
                            Đang cập nhật thông tin sản phẩm
                          </span>
                        )}
                      </div>

                      <div className={styles.orderPrice}>
                        <p>
                          {(firstItem?.price || 0).toLocaleString()} đ
                        </p>
                      </div>
                    </div>

                    <div className={styles.orderBottom}>
                      <strong>
                        Thành tiền:{" "}
                        <span className={styles.totalPrice}>
                          {(o.totalAmount || 0).toLocaleString()} đ
                        </span>
                      </strong>

                      <div className={styles.orderActions}>
                        {renderActions(o)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <OrderModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <ReviewModal
        order={reviewOrder}
        onClose={() => setReviewOrder(null)}
        onReview={(item) => {
          setSelectedItem(item);
          setOpenReviewForm(true);
        }}
      />

      {openReviewForm && selectedItem && (
        <ReviewFormModal
          item={selectedItem}
          onClose={() => {
            setOpenReviewForm(false);
            setSelectedItem(null);
          }}
          onSuccess={() => {
            if (!selectedItem || !reviewOrder) return;

            const selectedReviewItemId =
              selectedItem.orderItemId ?? selectedItem.itemId;

            setReviewOrder((prev: any) => ({
              ...prev,
              items: prev.items.map((it: any) =>
                (it.orderItemId ?? it.itemId) === selectedReviewItemId
                  ? { ...it, hasReview: true, hasRating: true }
                  : it
              ),
            }));

            setOrders((prev) =>
              prev.map((order) =>
                order.orderId === reviewOrder.orderId
                  ? {
                      ...order,
                      items: order.items?.map((it: any) =>
                        (it.orderItemId ?? it.itemId) === selectedReviewItemId
                          ? { ...it, hasReview: true, hasRating: true }
                          : it,
                      ),
                    }
                  : order,
              ),
            );
          }}
        />
      )}
    </>
  );
}
