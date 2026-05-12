import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useProductDetail } from "../../hooks/useProductDetail";
import ExploreCategories from "../../../home/components/ExploreCategories/ExploreCategories";
import { categoryService } from "../../../book-category/services/categoryService";
import type { Category } from "../../../book-category/types/category";
import "./ProductDetailPage.css";

import Evaluate from "../../../reviews/components/Evaluate/Evaluate";
import { evaluateApi } from "../../../../services/evaluateApi";
import type { Review } from "../../components/Evaluate/Evaluate";

import {
  FiShoppingCart,
  FiChevronRight,
} from "react-icons/fi";

import {
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";

import { TbTruckDelivery } from "react-icons/tb";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // ================= STATE =================
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  // ================= SAFE QUERY PARAMS (FIX NaN BUG) =================
  const query = new URLSearchParams(window.location.search);

  const orderIdRaw = query.get("orderId");
  const itemIdRaw = query.get("itemId");
  const view = query.get("view");

  const orderId = orderIdRaw ? Number(orderIdRaw) : null;
  const itemId = itemIdRaw ? Number(itemIdRaw) : null;

  const validReviewParams =
    !!id &&
    orderId !== null &&
    itemId !== null &&
    !isNaN(orderId) &&
    !isNaN(itemId);

  // ================= PRODUCT =================
  const {
    book,
    loading,
    quantity,
    setQuantity,
    isAdding,
    isBuying,
    handleAddToCart,
    handleBuyNow,
  } = useProductDetail(id);

  // ================= REVIEWS =================
const fetchReviews = async () => {
  if (!id) return;

  try {
    const data = await evaluateApi.getReviewsByBookId(Number(id));
    setReviews(data?.content ?? []);
  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  if (!id) return;
  fetchReviews();
}, [id]);

  // ================= CATEGORIES =================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data || []);
      } catch (error) {
        console.log("Fetch categories failed");
      }
    };

    fetchCategories();
  }, []);

  // ================= MY REVIEW (FIXED) =================
  useEffect(() => {
    if (!validReviewParams) return;

    const fetchMyReview = async () => {
      try {
        const data = await evaluateApi.getMyReview(
          Number(id),
          orderId!,
          itemId!
        );

        setMyReview(data || null);
      } catch (err) {
        console.log("Fetch my review failed", err);
      }
    };

    fetchMyReview();
  }, [id, orderId, itemId, view]);

  // ================= ORDER STATUS =================
  useEffect(() => {
    if (!orderId || isNaN(orderId)) return;

    setOrderStatus(null);

    const fetchOrderStatus = async () => {
      try {
        const order = await evaluateApi.getOrderById(orderId);
        setOrderStatus(order.status);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrderStatus();
  }, [orderId]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loader"></div>
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  // ================= NOT FOUND (FIX NULL SAFE) =================
  if (!book) {
    return (
      <div className="product-detail-error">
        <h2>Không tìm thấy sản phẩm</h2>
        <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      </div>
    );
  }

  // ================= RATING =================
  const renderRating = (rating: number = 0) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.round(rating)) {
        stars.push(
          <AiFillStar key={i} className="star filled" />
        );
      } else {
        stars.push(
          <AiOutlineStar key={i} className="star" />
        );
      }
    }

    return stars;
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-layout">
          {/* ================= LEFT ================= */}
          <div className="product-detail-left-col">
            <div className="product-card-white">
              {/* MAIN IMAGE */}
              <div className="main-image-wrapper">
                <img
                  src={
                    book.coverImgUrl ||
                    `https://picsum.photos/seed/book${book.bookId}/400/600`
                  }
                  alt={book.title}
                  className="main-image"
                />
              </div>

              {/* THUMBNAILS */}
              <div className="thumbnails-grid">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="thumb-box"
                  >
                    <img
                      src={`https://picsum.photos/seed/book${book.bookId + i}/100/150`}
                      alt="thumb"
                    />
                  </div>
                ))}
              </div>

              {/* ACTION BUTTONS */}
              <div className="button-actions-horizontal">
                <button
                  className={`outline-btn btn-flex ${
                    isAdding
                      ? "loading"
                      : ""
                  }`}
                  onClick={
                    handleAddToCart
                  }
                  disabled={
                    isAdding ||
                    isBuying
                  }
                >
                  <FiShoppingCart />

                  {isAdding
                    ? "Đang thêm..."
                    : "Thêm vào giỏ hàng"}
                </button>

                <button
                  className={`primary-btn btn-flex ${
                    isBuying
                      ? "loading"
                      : ""
                  }`}
                  onClick={
                    handleBuyNow
                  }
                  disabled={
                    isAdding ||
                    isBuying
                  }
                >
                  {isBuying
                    ? "Đang xử lý..."
                    : "Mua ngay"}
                </button>
              </div>

              {/* POLICY */}
              <div className="policy-list">
                <p className="policy-title">
                  Chính sách ưu đãi của
                  Katiia
                </p>

                <div className="policy-item">
                  <span className="policy-icon">
                    🚚
                  </span>

                  <div className="policy-text">
                    <p>
                      <strong>
                        Thời gian giao
                        hàng:
                      </strong>{" "}
                      giao nhanh, uy tín
                    </p>
                  </div>

                  <FiChevronRight className="chevron" />
                </div>

                <div className="policy-item">
                  <span className="policy-icon">
                    🛡️
                  </span>

                  <div className="policy-text">
                    <p>
                      <strong>
                        Chính sách đổi
                        trả:
                      </strong>{" "}
                      đổi trả miễn phí
                      toàn quốc
                    </p>
                  </div>

                  <FiChevronRight className="chevron" />
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="product-card-white mt-4 description-section">
              <h3 className="card-title">
                Mô tả sản phẩm
              </h3>

              <div className="description-content">
                <p>
                  <strong>
                    {book.title}
                  </strong>
                </p>

                <p>
                  {book.description ||
                    `Những câu chuyện nhỏ xảy ra ở một ngôi làng nhỏ... Đây là tác phẩm đầy ý nghĩa của tác giả ${book.authorName}.`}
                </p>
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="product-detail-right-col">
            {/* MAIN INFO */}
            <div className="product-card-white info-main-card">
              <h1 className="detail-title">
                {book.title}
              </h1>

              <div className="detail-meta-grid">
                <div className="meta-item">
                  Nhà cung cấp:{" "}
                  <span className="blue-text">
                    {book.publishers
                      ?.publisherName ||
                      "NXB Trẻ"}
                  </span>
                </div>

                <div className="meta-item">
                  Tác giả:{" "}
                  <strong>
                    {book.authorName}
                  </strong>
                </div>

                <div className="meta-item">
                  Nhà xuất bản:{" "}
                  <span>
                    {book.publishers
                      ?.publisherName ||
                      "NXB Trẻ"}
                  </span>
                </div>

                <div className="meta-item">
                  Hình thức bìa:{" "}
                  <strong>
                    {book.coverType ||
                      "Bìa mềm"}
                  </strong>
                </div>
              </div>

              {/* RATING */}
              <div className="detail-rating-row">
                <div className="stars-row">
                  {renderRating(
                    book.avgRating
                  )}
                </div>

                <span className="rating-count">
                  (
                  {book.reviewCount ||
                    0}{" "}
                  đánh giá)
                </span>
              </div>

              {/* PRICE */}
              <div className="detail-price-row">
                <div className="current-price">
                  {book.price?.toLocaleString(
                    "vi-VN"
                  )}
                  đ
                </div>

                {book.oldPrice && (
                  <div className="old-price">
                    {book.oldPrice.toLocaleString(
                      "vi-VN"
                    )}
                    đ
                  </div>
                )}
              </div>

              {/* QUANTITY */}
              <div className="qty-row">
                <span className="label">
                  Số lượng
                </span>

                <div className="qty-selector">
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.max(
                          1,
                          quantity - 1
                        )
                      )
                    }
                  >
                    -
                  </button>

                  <input
                    type="text"
                    value={quantity}
                    readOnly
                  />

                  <button
                    onClick={() =>
                      setQuantity(
                        quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* DELIVERY */}
            <div className="product-card-white mt-4 delivery-info-card">
              <h3 className="card-title">
                Thông tin vận chuyển
              </h3>

              <div className="delivery-location">
                <TbTruckDelivery className="delivery-icon" />

                <div className="location-text">
                  Giao hàng đến{" "}
                  <strong>
                    TP. Hồ Chí Minh
                  </strong>{" "}
                  <span className="change-link">
                    Thay đổi
                  </span>
                </div>
              </div>
            </div>

            {/* SPECS */}
            <div className="product-card-white mt-4 specs-card">
              <h3 className="card-title">
                Thông tin chi tiết
              </h3>

              <table className="specs-table">
                <tbody>
                  <tr>
                    <td>Mã hàng</td>
                    <td>
                      {book.bookId}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Tên nhà cung cấp
                    </td>

                    <td>
                      {book.publishers
                        ?.publisherName ||
                        "NXB Trẻ"}
                    </td>
                  </tr>

                  <tr>
                    <td>Tác giả</td>

                    <td>
                      {book.authorName}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Năm xuất bản
                    </td>

                    <td>
                      {book.publicationDate ||
                        "2023"}
                    </td>
                  </tr>

                  <tr>
                    <td>Ngôn ngữ</td>
                    <td>
                      Tiếng Việt
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Trọng lượng
                    </td>
                    <td>300g</td>
                  </tr>

                  <tr>
                    <td>
                      Kích thước
                    </td>

                    <td>
                      {book.dimensions ||
                        "13x20x2"}
                    </td>
                  </tr>

                  <tr>
                    <td>Số trang</td>

                    <td>
                      {book.numPages ||
                        "320"}
                    </td>
                  </tr>

                  <tr>
                    <td>Hình thức</td>

                    <td>
                      {book.coverType ||
                        "Bìa mềm"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RELATED BOOKS */}
        {/*
        <div className="related-section mt-5">
          <h2 className="section-main-title">
            CÓ THỂ BẠN SẼ THÍCH
          </h2>

          <div className="related-grid">
            {relatedBooks.map((b) => (
              <ProductCard
                key={b.bookId}
                book={b}
              />
            ))}
          </div>
        </div>
        */}

        {/*component danh gia san pham*/}
        <Evaluate
          reviews={reviews}
          myReview={myReview}
          orderStatus={orderStatus}
          onSuccess={fetchReviews}
        />


      </div>


        {/* EXPLORE */}
      <div className="mt-5 pb-5">
        <ExploreCategories
          categories={categories}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;