export type Author = {
  author_id: number;
  author_name: string;
  alias: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export const authorsMock: Author[] = [
  {
    author_id: 1,
    author_name: "Nguyễn Nhật Ánh",
    alias: "nguyen-nhat-anh",
    createdAt: "2025-01-10 10:00:00",
    updatedAt: "2025-01-10 10:00:00",
    deletedAt: null,
  },
  {
    author_id: 2,
    author_name: "Nam Cao",
    alias: "nam-cao",
    createdAt: "2025-01-12 14:20:00",
    updatedAt: "2025-01-12 14:20:00",
    deletedAt: null,
  },
  {
    author_id: 3,
    author_name: "Tô Hoài",
    alias: "to-hoai",
    createdAt: "2025-01-11 09:30:00",
    updatedAt: "2025-01-11 09:30:00",
    deletedAt: null,
  },
  {
    author_id: 4,
    author_name: "Kim Dung",
    alias: "kim-dung",
    createdAt: "2025-01-13 08:15:00",
    updatedAt: "2025-01-13 08:15:00",
    deletedAt: null,
  },
  {
    author_id: 5,
    author_name: "Haruki Murakami",
    alias: "haruki-murakami",
    createdAt: "2025-01-14 11:45:00",
    updatedAt: "2025-01-14 11:45:00",
    deletedAt: null,
  },
  {
    author_id: 6,
    author_name: "J.K. Rowling",
    alias: "jk-rowling",
    createdAt: "2025-01-15 16:10:00",
    updatedAt: "2025-01-15 16:10:00",
    deletedAt: null,
  },
  {
    author_id: 7,
    author_name: "George Orwell",
    alias: "george-orwell",
    createdAt: "2025-01-16 13:00:00",
    updatedAt: "2025-01-16 13:00:00",
    deletedAt: null,
  },
  {
    author_id: 8,
    author_name: "Ngô Tất Tố",
    alias: "ngo-tat-to",
    createdAt: "2025-01-17 09:00:00",
    updatedAt: "2025-01-17 09:00:00",
    deletedAt: null,
  },
];