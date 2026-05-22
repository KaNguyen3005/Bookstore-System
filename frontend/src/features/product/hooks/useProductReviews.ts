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

  // ================= REVIEWS =================
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ================= MY REVIEW =================
  useEffect(() => {
    if (!isAuthenticated || !validReviewParams) return;

    const fetchMyReview =
      async () => {
        try {
          const data =
            await evaluateApi.getMyReview(
              bookId,
              orderId!,
              itemId!
            );

          setMyReview(data || null);
        } catch (err) {
          console.log(
            "Fetch my review failed",
            err
          );
        }
      };

    fetchMyReview();
  }, [
    validReviewParams,
    isAuthenticated,
    bookId,
    orderId,
    itemId,
    view,
  ]);

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
        } catch (err) {
          console.log(
            "Fetch order status failed",
            err
          );
        }
      };

    fetchOrderStatus();
  }, [isAuthenticated, orderId]);

  return {
    reviews,
    myReview,
    orderStatus,
    fetchReviews,
  };
};
