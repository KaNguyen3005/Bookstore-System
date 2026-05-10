import {
  useState,
  useEffect,
  useCallback,
} from "react";

import { addressApi } from "../../../services/addressApi";

import type {
  CheckoutAddress,
} from "../types";

export const useAddressLogic = (
  onDefaultAddressFound?: (
    address: CheckoutAddress
  ) => void,
) => {

  const [
    addresses,
    setAddresses,
  ] = useState<CheckoutAddress[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  // =========================
  // FETCH ADDRESSES
  // =========================

  const fetchAddresses =
    useCallback(async () => {

      setLoading(true);

      try {

        const list =
          await addressApi.getAll();

        // luôn đảm bảo là array
        const safeList = Array.isArray(list)
          ? list
          : [];

        setAddresses(safeList);

        // =========================
        // DEFAULT ADDRESS
        // =========================

        if (
          safeList.length > 0 &&
          onDefaultAddressFound
        ) {

          const defaultAddr =
            safeList.find(
              (a) => a?.isDefault
            );

          onDefaultAddressFound(
            defaultAddr ||
              safeList[0]
          );
        }

      } catch (error) {

        console.error(
          "Failed to fetch address list:",
          error
        );

        setAddresses([]);

      } finally {

        setLoading(false);

      }

    }, [onDefaultAddressFound]);

  useEffect(() => {

    fetchAddresses();

  }, [fetchAddresses]);

  // =========================
  // ADD ADDRESS
  // =========================

  const addAddress = async (
    data: Omit<
      CheckoutAddress,
      "addressId" | "isDefault"
    >,
  ) => {

    setSubmitting(true);

    try {

      await addressApi.create(data);

      await fetchAddresses();

      return true;

    } catch (error) {

      console.error(
        "Failed to add address:",
        error
      );

      return false;

    } finally {

      setSubmitting(false);

    }
  };

  // =========================
  // UPDATE ADDRESS
  // =========================

  const updateAddress = async (
    id: number,
    data: Partial<CheckoutAddress>
  ) => {

    setSubmitting(true);

    try {

      await addressApi.update(
        id,
        data
      );

      await fetchAddresses();

      return true;

    } catch (error) {

      console.error(
        "Failed to update address:",
        error
      );

      return false;

    } finally {

      setSubmitting(false);

    }
  };

  // =========================
  // DELETE ADDRESS
  // =========================

  const deleteAddress = async (
    id: number
  ) => {

    setSubmitting(true);

    try {

      await addressApi.remove(id);

      setAddresses((prev) =>
        prev.filter(
          (item) =>
            item.addressId !== id
        )
      );

      return true;

    } catch (error) {

      console.error(
        "Failed to delete address:",
        error
      );

      return false;

    } finally {

      setSubmitting(false);

    }
  };

  // =========================
  // SET DEFAULT
  // =========================

  const setAsDefault = async (
    id: number
  ) => {

    setSubmitting(true);

    try {

      await addressApi.setDefault(id);

      await fetchAddresses();

      return true;

    } catch (error) {

      console.error(
        "Failed to set default address:",
        error
      );

      return false;

    } finally {

      setSubmitting(false);

    }
  };

  return {

    addresses,

    loading,

    submitting,

    refetch: fetchAddresses,

    addAddress,

    updateAddress,

    deleteAddress,

    setAsDefault,
  };
};