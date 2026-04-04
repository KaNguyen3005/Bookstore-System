// kdl
export interface Order {
  id: number;
  user_id: number;
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
    user_id: 1,
    status: "pending",
    name: "Sách React cơ bản",
    price: 120000,
    image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
    quantity: 1,
  },
  {
    id: 2,
    user_id: 1,
    status: "delivered",
    name: "Sách JavaScript nâng cao",
    price: 180000,
    image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
    quantity: 1,
  },
  {
    id: 3,
    user_id: 1,
    status: "return",
    name: "Học chi quá là mệt",
    price: 180000,
    image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
     quantity: 1,
  },
 {
    id: 55,
    user_id: 1,
    status: "pending",
    name: "Học chi quá là mệt",
    price: 180000,
    image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
     quantity: 1,
  },
 {
    id: 5,
    user_id: 1,
    status: "shipping",
    name: "Sách React cơ bản",
    price: 120000,
        image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
         quantity: 1,
  },
 {
    id: 6,
    user_id: 1,
    status: "delivered",
    name: "Sách React cơ bản",
    price: 120000,
        image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
         quantity: 1,
  },
 {
    id: 7,
    user_id: 1,
    status: "cancel",
    name: "Sách React cơ bản",
    price: 120000,
        image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
         quantity: 1,
  },
{
    id: 8,
    user_id: 1,
    status: "cancel",
    name: "Sách React cơ bản",
    price: 120000,
        image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
         quantity: 1,
  },
{
    id: 9,
    user_id: 1,
    status: "pickup",
    name: "aaaaaaaaaaaaaaaaaaaaaaaaaa",
    price: 120000,
        image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
         quantity: 1,
  },
{
    id: 10,
    user_id: 1,
    status: "pickup",
    name: "bbbbbbbbbbbbbbbbbbbbbb",
    price: 120000,
        image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
         quantity: 1,
  },
{
  id: 11,
  user_id: 5,
  status: "pending",
  name: "B book",
      price: 180000,
      image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
      quantity: 1,
},
{
  id: 12,
  user_id: 5,
  status: "pending",
  name: "B book",
      price: 180000,
      image: "https://animotaku.fr/wp-content/uploads/2024/12/film-detective-conan-28-flashback-borgne-visuel-1.jpg",
      quantity: 1,
}
];