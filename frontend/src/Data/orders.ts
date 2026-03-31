// kdl
export interface Order {
  id: number;
  status: OrderStatus;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// FE + BE
export type OrderStatus =
  | "pending"
  | "pickup"
  | "shipping"
  | "delivered"
  | "return"
  | "cancel";

// UI
export const orderStatusLabel: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  pickup: "Chờ lấy hàng",
  shipping: "Chờ giao hàng",
  delivered: "Đã giao",
  return: "Trả hàng",
  cancel: "Đã hủy",
};

export const mockOrders: Order[] = [
  {
    id: 1,
    status: "pending",
    name: "Sách React cơ bản",
    price: 120000,
    image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
    quantity: 1,
  },
  {
    id: 2,
    status: "delivered",
    name: "Sách JavaScript nâng cao",
    price: 180000,
    image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
    quantity: 1,
  },
  {
    id: 3,
    status: "return",
    name: "Học chi quá là mệt",
    price: 180000,
    image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
     quantity: 1,
  },
 {
    id: 3,
    status: "pending",
    name: "Học chi quá là mệt",
    price: 180000,
    image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
     quantity: 1,
  },
 {
    id: 1,
    status: "shipping",
    name: "Sách React cơ bản",
    price: 120000,
        image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
         quantity: 1,
  },
 {
    id: 1,
    status: "delivered",
    name: "Sách React cơ bản",
    price: 120000,
        image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
         quantity: 1,
  },
 {
    id: 1,
    status: "cancel",
    name: "Sách React cơ bản",
    price: 120000,
        image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
         quantity: 1,
  },
{
    id: 1,
    status: "cancel",
    name: "Sách React cơ bản",
    price: 120000,
        image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
         quantity: 1,
  },
{
    id: 1,
    status: "pickup",
    name: "aaaaaaaaaaaaaaaaaaaaaaaaaa",
    price: 120000,
        image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
         quantity: 1,
  },
{
    id: 1,
    status: "pickup",
    name: "bbbbbbbbbbbbbbbbbbbbbb",
    price: 120000,
        image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
         quantity: 1,
  },
];