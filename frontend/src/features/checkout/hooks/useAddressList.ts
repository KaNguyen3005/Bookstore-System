import { useState, useEffect } from "react";
import { addressApi } from "../../../services/addressApi";
import type { CheckoutAddress } from "../types";

export const useAddressList = (userId: string | number | undefined, onDefaultAddressFound?: (address: CheckoutAddress) => void) => {
  const [addresses, setAddresses] = useState<CheckoutAddress[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const list = await addressApi.getAll(userId);
        setAddresses(list);
        
        const defaultAddr = list.find((a: any) => a.is_default);
        if (defaultAddr && onDefaultAddressFound) {
          onDefaultAddressFound(defaultAddr);
        } else if (list.length > 0 && onDefaultAddressFound) {
          onDefaultAddressFound(list[0]);
        }
      } catch (error) {
        console.error("Failed to fetch address list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userId, onDefaultAddressFound]);

  return { addresses, loading };
};
