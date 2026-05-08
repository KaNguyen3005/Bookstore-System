import { useState, useEffect, useCallback } from "react";
import { addressApi } from "../../../services/addressApi";
import type { CheckoutAddress } from "../types";

export const useAddressLogic = (
  onDefaultAddressFound?: (address: CheckoutAddress) => void,
) => {
  const [addresses, setAddresses] = useState<CheckoutAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const list = await addressApi.getAll();
      setAddresses(list);

      const defaultAddr = list.find((a: CheckoutAddress) => a.isDefault);
      if (defaultAddr && onDefaultAddressFound) {
        onDefaultAddressFound(defaultAddr);
      } else if (list.length > 0 && onDefaultAddressFound) {
        // Fallback to first address if no default found but list is not empty
        onDefaultAddressFound(list[0]);
      }
    } catch (error) {
      console.error("Failed to fetch address list:", error);
    } finally {
      setLoading(false);
    }
  }, [onDefaultAddressFound]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = async (
    data: Omit<CheckoutAddress, "addressId" | "isDefault">,
  ) => {
    setSubmitting(true);
    try {
      await addressApi.create(data);
      await fetchAddresses();
      return true;
    } catch (error) {
      console.error("Failed to add address:", error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateAddress = async (id: number, data: Partial<CheckoutAddress>) => {
    setSubmitting(true);
    try {
      await addressApi.update(id, data);
      await fetchAddresses();
      return true;
    } catch (error) {
      console.error("Failed to update address:", error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAddress = async (id: number) => {
    setSubmitting(true);

    try {
      await addressApi.remove(id);

      // cập nhật UI ngay lập tức
      setAddresses((prev) => prev.filter((item) => item.addressId !== id));

      return true;
    } catch (error) {
      console.error("Failed to delete address:", error);

      return false;
    } finally {
      setSubmitting(false);
    }
  };
  const setAsDefault = async (id: number) => {
    setSubmitting(true);
    try {
      await addressApi.setDefault(id);
      await fetchAddresses();
      return true;
    } catch (error) {
      console.error("Failed to set default address:", error);
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
