import React from "react";

import "./ProductDetailPage.css";

import { useProductDetail } from "../../hooks/useProductDetail";
import { useCategories } from "../../hooks/useCategories";
import { useProductReviews } from "../../hooks/useProductReviews";
import { useProductParams } from "../../hooks/useProductParams";

import ExploreCategories from "../../../home/components/ExploreCategories/ExploreCategories";
import Evaluate from "../../../reviews/components/Evaluate/Evaluate";

import ProductGallery from "../../components/ProductGallery/ProductGallery";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import ProductSpecs from "../../components/ProductSpecs/ProductSpecs";
import ProductDelivery from "../../components/ProductDelivery/ProductDelivery";
import ProductDescription from "../../components/ProductDescription/ProductDescription";
import ProductPolicy from "../../components/ProductPolicy/ProductPolicy";

import RelatedBooks from "../../../AI/components/RelatedBooks/RelatedBooks";

const ProductDetailPage: React.FC = () => {
  // ================= PARAMS =================
  const {
    id,
    bookId,
    orderId,
    itemId,
    view,
    isValidBookId,
  } = useProductParams();

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

  // ================= CATEGORIES =================
  const { categories } = useCategories();

  // ================= REVIEWS =================
  const {
    reviews,
    myReview,
    orderStatus,
    fetchReviews,
  } = useProductReviews({
    bookId,
    orderId,
    itemId,
    view,
    isValidBookId,
  });

  // ================= EARLY RETURNS =================
  if (!isValidBookId) {
    return (
      <div className="product-detail-error">
        <h2>ID sản phẩm không hợp lệ</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loader"></div>
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="product-detail-error">
        <h2>Không tìm thấy sản phẩm</h2>
        <p>
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    );
  }

  // ================= SAFE DATA =================
  const publisherName =
    book.publisher?.publisherName || "NXB Trẻ";

  const authorName =
    book.authors?.[0]?.authorName || "Đang cập nhật";

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
              description={book.description}
              authorName={authorName}
            />
          </div>

          {/* RIGHT */}
          <div className="product-detail-right-col">
            <ProductInfo
              book={book}
              publisherName={publisherName}
              authorName={authorName}
              reviewsCount={reviews.length}
              quantity={quantity}
              setQuantity={setQuantity}
              isAdding={isAdding}
              isBuying={isBuying}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />

            <ProductDelivery />

            <ProductSpecs
              book={book}
              publisherName={publisherName}
              authorName={authorName}
            />
          </div>
        </div>

        {/* REVIEWS */}
        <div className="mt-4">
          <Evaluate
            reviews={reviews}
            myReview={myReview}
            orderStatus={orderStatus}
            onSuccess={fetchReviews}
          />
        </div>

        {/* RELATED BOOKS (AI / recommendation theo sach tuong tu) */}
        <div className="mt-5">
          {book?.bookId && (
            <RelatedBooks bookId={book.bookId} />
          )}
        </div>

      </div>

      {/* EXPLORE */}
      <div className="mt-5 pb-5">
        <ExploreCategories categories={categories} />
      </div>
    </div>
  );
};

export default ProductDetailPage;