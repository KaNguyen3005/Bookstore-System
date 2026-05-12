import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  useParams,
  useSearchParams,
} from "react-router-dom";

import "./ProductDetailPage.css";

import { useProductDetail } from "../../hooks/useProductDetail";

import ExploreCategories from "../../../home/components/ExploreCategories/ExploreCategories";

import Evaluate from "../../../reviews/components/Evaluate/Evaluate";

import { categoryService } from "../../../book-category/services/categoryService";

import { evaluateApi } from "../../../../services/evaluateApi";

import type { Category } from "../../../book-category/types/category";

import type { Review } from "../../../reviews/components/Evaluate/Evaluate";

import ProductGallery from "../../components/ProductGallery/ProductGallery";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import ProductSpecs from "../../components/ProductSpecs/ProductSpecs";
import ProductDelivery from "../../components/ProductDelivery/ProductDelivery";
import ProductDescription from "../../components/ProductDescription/ProductDescription";
import ProductPolicy from "../../components/ProductPolicy/ProductPolicy";

const ProductDetailPage: React.FC = () => {
  // ================= PARAMS =================
  const { id } = useParams<{ id: string }>();

  const [searchParams] =
    useSearchParams();

  const bookId = Number(id);

  const orderIdRaw =
    searchParams.get("orderId");

  const itemIdRaw =
    searchParams.get("itemId");

  const view =
    searchParams.get("view");

  const orderId = orderIdRaw
    ? Number(orderIdRaw)
    : null;

  const itemId = itemIdRaw
    ? Number(itemIdRaw)
    : null;

  // ================= STATES =================
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [myReview, setMyReview] =
    useState<Review | null>(null);

  const [orderStatus, setOrderStatus] =
    useState<string | null>(null);

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

  // ================= VALIDATION =================
  const isValidBookId =
    !!id && !isNaN(bookId);

  const validReviewParams =
    isValidBookId &&
    orderId !== null &&
    itemId !== null &&
    !isNaN(orderId) &&
    !isNaN(itemId);

  // ================= FETCH REVIEWS =================
  const fetchReviews = useCallback(
    async () => {
      if (!isValidBookId) return;

      try {
        const data =
          await evaluateApi.getReviewsByBookId(
            bookId
          );

        setReviews(data?.content ?? []);
      } catch (err) {
        console.log(
          "Fetch reviews failed",
          err
        );
      }
    },
    [bookId, isValidBookId]
  );

  // ================= EFFECTS =================
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    const fetchCategories =
      async () => {
        try {
          const data =
            await categoryService.getCategories();

          setCategories(data || []);
        } catch (error) {
          console.log(
            "Fetch categories failed",
            error
          );
        }
      };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!validReviewParams) return;

    const fetchMyReview =
      async () => {
        try {
          const data =
            await evaluateApi.getMyReview(
              bookId,
              orderId!,
              itemId!
            );

          setMyReview(data || null);
        } catch (err) {
          console.log(
            "Fetch my review failed",
            err
          );
        }
      };

    fetchMyReview();
  }, [
    validReviewParams,
    bookId,
    orderId,
    itemId,
    view,
  ]);

  useEffect(() => {
    if (
      orderId === null ||
      isNaN(orderId)
    )
      return;

    const fetchOrderStatus =
      async () => {
        try {
          const order =
            await evaluateApi.getOrderById(
              orderId
            );

          setOrderStatus(order.status);
        } catch (err) {
          console.log(
            "Fetch order status failed",
            err
          );
        }
      };

    fetchOrderStatus();
  }, [orderId]);

  // ================= EARLY RETURN =================
  if (!isValidBookId) {
    return (
      <div className="product-detail-error">
        <h2>
          ID sản phẩm không hợp lệ
        </h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loader"></div>

        <p>
          Đang tải thông tin sản phẩm...
        </p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="product-detail-error">
        <h2>
          Không tìm thấy sản phẩm
        </h2>

        <p>
          Sản phẩm bạn đang tìm kiếm
          không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    );
  }

  // ================= SAFE DATA =================
  const publisherName =
    book.publisher?.publisherName ||
    "NXB Trẻ";

  const authorName =
    book.authors?.[0]?.authorName ||
    "Đang cập nhật";

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-layout">
          {/* LEFT */}
          <div className="product-detail-left-col">
            <div className="product-card-white">
              <ProductGallery book={book} />

              <ProductPolicy />
            </div>

            <ProductDescription
              title={book.title}
              description={
                book.description
              }
              authorName={authorName}
            />
          </div>

          {/* RIGHT */}
          <div className="product-detail-right-col">
            <ProductInfo
              book={book}
              publisherName={
                publisherName
              }
              authorName={authorName}
              reviewsCount={
                reviews.length
              }
              quantity={quantity}
              setQuantity={
                setQuantity
              }
              isAdding={isAdding}
              isBuying={isBuying}
              onAddToCart={
                handleAddToCart
              }
              onBuyNow={
                handleBuyNow
              }
            />

            <ProductDelivery />

            <ProductSpecs
              book={book}
              publisherName={
                publisherName
              }
              authorName={authorName}
            />
          </div>
        </div>

        {/* REVIEWS */}
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