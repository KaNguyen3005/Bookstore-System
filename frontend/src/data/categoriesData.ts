import type { Category } from "../features/book-category/types/category";
export const categoriesData: Category[] = [
  {
    categoryId: 1,
    categoryName: "Văn học",
    children: [
      { categoryId: 101, categoryName: "Văn học Việt Nam" },
      { categoryId: 102, categoryName: "Văn học nước ngoài" },
      { categoryId: 103, categoryName: "Tiểu thuyết" },
    ]
  },
  { categoryId: 2, categoryName: "Giả tưởng" },
  {
    categoryId: 3,
    categoryName: "Công nghệ",
    children: [
      { categoryId: 301, categoryName: "Phần mềm" },
      { categoryId: 302, categoryName: "Phần cứng" },
    ]
  },
  { categoryId: 4, categoryName: "Lập trình" },
  { categoryId: 5, categoryName: "Lãng mạn" },
  { categoryId: 6, categoryName: "Lịch sử" },
  {
    categoryId: 7,
    categoryName: "Khoa học",
    children: [
      { categoryId: 701, categoryName: "Vật lý" },
      { categoryId: 702, categoryName: "Hóa học" },
      { categoryId: 703, categoryName: "Sinh học" },
    ]
  },
  { categoryId: 8, categoryName: "Triết lý" },
  { categoryId: 9, categoryName: "Tâm lý" },
  { categoryId: 10, categoryName: "Tội phạm" },
  { categoryId: 11, categoryName: "Kỹ năng sống" }
];
