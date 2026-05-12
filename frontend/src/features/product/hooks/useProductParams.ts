import {
  useParams,
  useSearchParams,
} from "react-router-dom";

export const useProductParams = () => {
  const { id } =
    useParams<{ id: string }>();

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

  const isValidBookId =
    !!id && !isNaN(bookId);

  return {
    id,
    bookId,
    orderId,
    itemId,
    view,
    isValidBookId,
  };
};