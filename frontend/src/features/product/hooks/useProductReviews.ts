import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { evaluateApi } from "../../../services/evaluateApi";
import { useAuth } from "../../auth/hooks/useAuth";

import type { Review } from "../../reviews/components/Evaluate/Evaluate";

interface UseProductReviewsProps {
  bookId: number;
  orderId: number | null;
  itemId: number | null;
  view: string | null;
  isValidBookId: boolean;
}

export const useProductReviews = ({
  bookId,
  orderId,
  itemId,
  view,
  isValidBookId,
}: UseProductReviewsProps) => {
  const { isAuthenticated } = useAuth();

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [myReview, setMyReview] =
    useState<Review | null>(null);

  const [orderStatus, setOrderStatus] =
    useState<string | null>(null);

  // ================= VALID REVIEW PARAMS =================
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

  const submitReview = useCallback(
    async (data: { rating: number; content: string }) => {
      if (!validReviewParams) {
        return false;
      }

      const reviewedItem = await evaluateApi.reviewOrderItem(
        orderId!,
        itemId!,
        data
      );

      setMyReview({
        bookId,
        bookTitle: reviewedItem?.bookTitle ?? null,
        quantity: reviewedItem?.quantity ?? 0,
        price: reviewedItem?.price ?? null,
        rate: reviewedItem?.rate ?? data.rating,
        content: reviewedItem?.content ?? data.content,
        unit: reviewedItem?.unit ?? "",
      });

      await fetchReviews();

      return true;
    },
    [bookId, fetchReviews, itemId, orderId, validReviewParams]
  );

  // ================= REVIEWS =================
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ================= ORDER STATUS =================
  useEffect(() => {
    if (
      !isAuthenticated ||
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

          const reviewedItem = order.items?.find(
            (item: any) => Number(item.orderItemId) === Number(itemId)
          );

          if (reviewedItem?.rate && reviewedItem?.content?.trim()) {
            setMyReview({
              bookId,
              bookTitle: reviewedItem.bookTitle ?? null,
              quantity: reviewedItem.quantity ?? 0,
              price: reviewedItem.price ?? null,
              rate: reviewedItem.rate,
              content: reviewedItem.content,
              unit: reviewedItem.unit ?? "",
            });
          } else {
            setMyReview(null);
          }
        } catch (err) {
          console.log(
            "Fetch order status failed",
            err
          );
        }
      };

    fetchOrderStatus();
  }, [bookId, isAuthenticated, itemId, orderId, view]);

  return {
    reviews,
    myReview,
    orderStatus,
    fetchReviews,
    submitReview,
  };
};
