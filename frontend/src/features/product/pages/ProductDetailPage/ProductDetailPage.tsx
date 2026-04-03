import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById, getRelatedBooks } from "../../services/bookService";
import type { Book } from "../../types/Book";
import { useCart } from "../../../cart/hooks/useCart";
import { useRequireAuth } from "../../../auth/hooks/useRequireAuth";
import ProductCard from "../../../cart/pages/ProductCard/ProductCard";
import ExploreCategories from "../../../home/components/ExploreCategories/ExploreCategories";
import "./ProductDetailPage.css";
import { FiShoppingCart, FiChevronRight } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { handleAuthAction } = useRequireAuth();

  const getCartItem = () => {
    if (!book) return null;
    return {
      book_id: book.book_id,
      title: book.title,
      price: book.oldPrice || book.price,
      sale_percent: book.sale_percent || 0,
      cover_image_url: book.cover_image_url || `https://picsum.photos/seed/book${book.book_id}/400/600`,
      quantity: quantity,
      stock_quantity: 100, // mock stock
      selected: true
    };
  };

  const handleAddToCart = () => {
    const item = getCartItem();
    if (!item) return;

    handleAuthAction(() => {
      addToCart(item);
      alert("Đã thêm vào giỏ hàng");
    }, { type: 'ADD_TO_CART', payload: item });
  };

  const handleBuyNow = () => {
    const item = getCartItem();
    if (!item) return;

    handleAuthAction(() => {
      addToCart(item);
      window.location.href = '/checkout';
    }, { type: 'BUY_NOW', payload: item });
  };

  useEffect(() => {
    const fetchBookData = async () => {
      if (!id) return;
      setLoading(true);
      const bookId = parseInt(id);
      const [bookData, relatedData] = await Promise.all([
        getBookById(bookId),
        getRelatedBooks(bookId),
      ]);
      setBook(bookData);
      setRelatedBooks(relatedData);
      setLoading(false);
      window.scrollTo(0, 0);
    };

    fetchBookData();
  }, [id]);

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
        <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      </div>
    );
  }

  const renderRating = (rating: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.round(rating)) {
        stars.push(<AiFillStar key={i} className="star filled" />);
      } else {
        stars.push(<AiOutlineStar key={i} className="star" />);
      }
    }
    return stars;
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-layout">
          {/* LEFT: Image & Thumbnails */}
          <div className="product-detail-left-col">
            <div className="product-card-white">
              <div className="main-image-wrapper">
                <img
                  src={book.cover_image_url || `https://picsum.photos/seed/book${book.book_id}/400/600`}
                  alt={book.title}
                  className="main-image"
                />
              </div>
              <div className="thumbnails-grid">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="thumb-box">
                    <img src={`https://picsum.photos/seed/book${book.book_id + i}/100/150`} alt="thumb" />
                  </div>
                ))}
              </div>
              <div className="button-actions-horizontal">
                <button className="outline-btn btn-flex" onClick={handleAddToCart}>
                  <FiShoppingCart /> Thêm vào giỏ hàng
                </button>
                <button className="primary-btn btn-flex" onClick={handleBuyNow}>Mua ngay</button>
              </div>
              <div className="policy-list">
                <p className="policy-title">Chính sách ưu đãi của Katiia</p>
                <div className="policy-item">
                  <span className="policy-icon">🚚</span>
                  <div className="policy-text">
                    <p><strong>Thời gian giao hàng:</strong> giao nhanh, uy tín</p>
                  </div>
                  <FiChevronRight className="chevron" />
                </div>
                <div className="policy-item">
                  <span className="policy-icon">🛡️</span>
                  <div className="policy-text">
                    <p><strong>Chính sách đổi trả:</strong> đổi trả miễn phí toàn quốc</p>
                  </div>
                  <FiChevronRight className="chevron" />
                </div>
              </div>
            </div>

            {/* Description Section (Moves under left in design) */}
            <div className="product-card-white mt-4 description-section">
              <h3 className="card-title">Mô tả sản phẩm</h3>
              <div className="description-content">
                <p><strong>{book.title}</strong></p>
                <p>{book.description || `Những câu chuyện nhỏ xảy ra ở một ngôi làng nhỏ... Đây là tác phẩm đầy ý nghĩa của tác giả ${book.author_name}.`}</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Main Info */}
          <div className="product-detail-right-col">
            <div className="product-card-white info-main-card">
              <h1 className="detail-title">{book.title}</h1>
              <div className="detail-meta-grid">
                <div className="meta-item">Nhà cung cấp: <span className="blue-text">{book.publisher || "NXB Trẻ"}</span></div>
                <div className="meta-item">Tác giả: <strong>{book.author_name}</strong></div>
                <div className="meta-item">Nhà xuất bản: <span>{book.publisher || "NXB Trẻ"}</span></div>
                <div className="meta-item">Hình thức bìa: <strong>{book.cover_type || "Bìa mềm"}</strong></div>
              </div>

              <div className="detail-rating-row">
                <div className="stars-row">{renderRating(book.avg_rating)}</div>
                <span className="rating-count">({book.reviewCount || 0} đánh giá)</span>
              </div>

              <div className="detail-price-row">
                <div className="current-price">{book.price?.toLocaleString("vi-VN")}đ</div>
                {book.oldPrice && <div className="old-price">{book.oldPrice.toLocaleString("vi-VN")}đ</div>}
              </div>

              <div className="qty-row">
                <span className="label">Số lượng</span>
                <div className="qty-selector">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <input type="text" value={quantity} readOnly />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
            </div>

            {/* Delivery Info Card */}
            <div className="product-card-white mt-4 delivery-info-card">
              <h3 className="card-title">Thông tin vận chuyển</h3>
              <div className="delivery-location">
                <TbTruckDelivery className="delivery-icon" />
                <div className="location-text">
                  Giao hàng đến <strong>TP. Hồ Chí Minh</strong> <span className="change-link">Thay đổi</span>
                </div>
              </div>
              <div className="delivery-service">
                <p className="service-name">Giao hàng tiêu chuẩn</p>
                <p className="delivery-time">Thời gian giao hàng dự kiến: <strong>1/1/2026</strong></p>
              </div>
              <div className="vouchers-section">
                <p className="voucher-title">Ưu đãi giảm giá</p>
                <div className="voucher-list">
                  <span className="voucher-tag">Mã giảm 10k</span>
                  <span className="voucher-tag yellow">🎁 Mã giảm 20k</span>
                  <span className="voucher-tag orange">🎁 Mã giảm 35k</span>
                  <span className="voucher-tag red">🎁 Mã giảm 50%</span>
                </div>
              </div>
            </div>

            {/* Specs Table Card */}
            <div className="product-card-white mt-4 specs-card">
              <h3 className="card-title">Thông tin chi tiết</h3>
              <table className="specs-table">
                <tbody>
                  <tr><td>Mã hàng</td><td>{book.book_id}</td></tr>
                  <tr><td>Tên nhà cung cấp</td><td>{book.publisher || "NXB Trẻ"}</td></tr>
                  <tr><td>Tác giả</td><td>{book.author_name}</td></tr>
                  <tr><td>Năm xuất bản</td><td>{book.publication_date || "2023"}</td></tr>
                  <tr><td>Ngôn ngữ</td><td>Tiếng Việt</td></tr>
                  <tr><td>Trọng lượng</td><td>300g</td></tr>
                  <tr><td>Kích thước</td><td>{book.dimensions || "13x20x2"}</td></tr>
                  <tr><td>Số trang</td><td>{book.num_pages || "320"}</td></tr>
                  <tr><td>Hình thức</td><td>{book.cover_type || "Bìa mềm"}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Rating Section (Full Width Bottom) */}
        <div className="product-card-white mt-4 rating-summary-section">
          <h3 className="card-title">Đánh giá sản phẩm</h3>
          <div className="rating-flex">
            <div className="rating-score">
              <p className="big-score">0 / 5</p>
              <div className="stars-row">{renderRating(0)}</div>
              <p className="total-reviews">(0 đánh giá)</p>
            </div>
            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map(star => (
                <div key={star} className="rating-bar-item">
                  <span>{star} sao</span>
                  <div className="bar-bg"><div className="bar-fill" style={{ width: '0%' }}></div></div>
                  <span>0%</span>
                </div>
              ))}
            </div>
            <div className="rating-auth-msg">
              Vui lòng <span className="blue-text pointer">đăng nhập</span> hoặc <span className="blue-text pointer">đăng ký</span> mới được đánh giá sản phẩm.
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="related-section mt-5">
          <h2 className="section-main-title">CÓ THỂ BẠN SẼ THÍCH</h2>
          <div className="related-grid">
            {relatedBooks.map(b => (
              <ProductCard key={b.book_id} book={b} />
            ))}
          </div>
        </div>
      </div>

      {/* EXPLORE CATEGORIES */}
      <div className="mt-5 pb-5">
        <ExploreCategories />
      </div>
    </div>
  );
};

export default ProductDetailPage;
