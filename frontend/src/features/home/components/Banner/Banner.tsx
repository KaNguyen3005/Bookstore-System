"use client";
import { useEffect, useState } from "react";
import "./Banner.css";

type Slide = {
  id: number;
  image: string;
  title: string;
  description: string;
};

const slides: Slide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    title: "Khám phá kho sách",
    description: "Hàng ngàn đầu sách hay đang chờ bạn",
  },
  {
    id: 2,
    image: "http://datadesignsb.com/wp-content/uploads/2017/08/thiet-ke-website-ban-sach.jpg",
    title: "Top sách bán chạy",
    description: "Xu hướng đọc mới nhất",
  },
  {
    id: 3,
    image: "https://static.vecteezy.com/system/resources/previews/011/640/720/non_2x/flash-sale-banner-template-design-for-web-or-social-media-vector.jpg",
    title: "Ưu đãi hấp dẫn",
    description: "Giảm giá lên đến 50%",
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="banner">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`banner__slide ${
            index === current ? "banner__slide--active" : ""
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="banner__overlay">
            <h2 className="banner__title">{slide.title}</h2>
            <p className="banner__desc">{slide.description}</p>
            <button className="banner__btn">Xem ngay</button>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="banner__dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`banner__dot ${
              index === current ? "banner__dot--active" : ""
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;