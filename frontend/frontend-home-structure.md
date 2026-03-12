# Hướng dẫn cấu trúc trang Home

## Cấu trúc thư mục

```
frontend/src/
├── components/
│   ├── home/                    # Các component riêng cho trang Home
│   │   ├── HeroBanner.tsx       # Banner trên cùng (màu xanh nhạt + ảnh sách)
│   │   ├── HotSearchBooks.tsx   # Carousel sách hot search
│   │   ├── TopSellingBooks.tsx  # Grid sách bán chạy
│   │   └── ExploreCategories.tsx # Danh mục sách
│   ├── product/
│   │   └── ProductCard.tsx      # Card sách dùng chung (rating, giá, nút giỏ hàng)
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Layout.tsx
├── styles/
│   ├── home/
│   │   ├── Home.css
│   │   ├── HeroBanner.css
│   │   ├── HotSearchBooks.css
│   │   ├── TopSellingBooks.css
│   │   └── ExploreCategories.css
│   └── product/
│       └── ProductCard.css
├── constants/
│   └── categories.ts            # Danh sách danh mục sách
├── Data/
│   └── homeBooks.ts             # Dữ liệu mẫu (sau này thay bằng API)
├── types/
│   └── Book.ts
└── pages/
    └── Home.tsx                 # Ghép các section
```

## Luồng dữ liệu

1. **Home.tsx** nhận dữ liệu từ `Data/homeBooks.ts` (hoặc gọi API qua `bookService`)
2. Truyền xuống:
   - `HotSearchBooks` nhận `books`
   - `TopSellingBooks` nhận `books`
3. **ProductCard** nhận từng `book` qua props

## Kết nối API thật

Khi backend sẵn sàng, thay trong `Home.tsx`:

```tsx
const [hotBooks, setHotBooks] = useState<Book[]>([]);
const [topBooks, setTopBooks] = useState<Book[]>([]);

useEffect(() => {
  getHotSearchBooks().then(setHotBooks);
  getTopSellingBooks().then(setTopBooks);
}, []);
```

Và cập nhật `bookService.ts` với các hàm `getHotSearchBooks`, `getTopSellingBooks`.
