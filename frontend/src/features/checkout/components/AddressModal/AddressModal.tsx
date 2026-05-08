import React, { useEffect, useState } from "react";
import { FiX, FiPlus, FiArrowLeft } from "react-icons/fi";

import type { CheckoutAddress } from "../../types";
import { addressApi } from "../../../../services/addressApi";
import { useAddressLogic } from "../../hooks/useAddressLogic";

import "./AddressModal.css";

interface AddressModalProps {
  isOpen: boolean;
  currentAddress: CheckoutAddress | null;
  onSelect: (address: CheckoutAddress) => void;
  onClose: () => void;
}

type ViewMode = "list" | "form";

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  currentAddress,
  onSelect,
  onClose,
}) => {
  const {
    addresses,
    loading,
    submitting,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useAddressLogic();

  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [selected, setSelected] = useState<CheckoutAddress | null>(
    currentAddress,
  );

  const [editingAddress, setEditingAddress] =
    useState<CheckoutAddress | null>(null);

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
    isDefault: false,
  });

  const [phoneError, setPhoneError] = useState("");

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] =
    useState<string>("");

  const [selectedDistrictId, setSelectedDistrictId] =
    useState<string>("");

  const [selectedWardCode, setSelectedWardCode] =
    useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setSelected(currentAddress);
      setViewMode("list");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, currentAddress]);

  // Load provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await addressApi.getProvinces();

        setProvinces(data);
      } catch (err) {
        console.error("Failed to load provinces", err);
      }
    };

    fetchProvinces();
  }, []);

  const handleOpenForm = async (addr?: CheckoutAddress) => {
    setPhoneError("");

    if (addr) {
      setEditingAddress(addr);

      setFormData({
        customerName: addr.customerName,
        customerPhone: addr.customerPhone,
        province: addr.province,
        district: addr.district,
        ward: addr.ward,
        detailAddress: addr.detailAddress,
        isDefault: addr.isDefault || false,
      });

      // tìm province
      const prov = provinces.find(
        (p) => p.provinceName === addr.province,
      );

      if (prov) {
        setSelectedProvinceId(String(prov.provinceId));

        const districtData = await addressApi.getDistricts(
          prov.provinceId,
        );

        setDistricts(districtData);

        // tìm district
        const dist = districtData.find(
          (d: any) => d.districtName === addr.district,
        );

        if (dist) {
          setSelectedDistrictId(String(dist.districtId));

          const wardData = await addressApi.getWards(
            dist.districtId,
          );

          setWards(wardData);

          // tìm ward
          const ward = wardData.find(
            (w: any) => w.wardName === addr.ward,
          );

          if (ward) {
            setSelectedWardCode(String(ward.wardId));
          }
        }
      }
    } else {
      setEditingAddress(null);

      setFormData({
        customerName: "",
        customerPhone: "",
        province: "",
        district: "",
        ward: "",
        detailAddress: "",
        isDefault: false,
      });

      setSelectedProvinceId("");
      setSelectedDistrictId("");
      setSelectedWardCode("");

      setDistricts([]);
      setWards([]);
    }

    setViewMode("form");
  };

  const handleProvinceChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const provId = e.target.value;

    const province = provinces.find(
      (p) => String(p.provinceId) === provId,
    );

    setSelectedProvinceId(provId);

    setFormData({
      ...formData,
      province: province?.provinceName || "",
      district: "",
      ward: "",
    });

    setSelectedDistrictId("");
    setSelectedWardCode("");

    setWards([]);

    if (provId) {
      const data = await addressApi.getDistricts(provId);

      setDistricts(data);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const distId = e.target.value;

    const district = districts.find(
      (d) => String(d.districtId) === distId,
    );

    setSelectedDistrictId(distId);

    setFormData({
      ...formData,
      district: district?.districtName || "",
      ward: "",
    });

    setSelectedWardCode("");

    if (distId) {
      const data = await addressApi.getWards(distId);

      setWards(data);
    } else {
      setWards([]);
    }
  };

  const handleWardChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const wardId = e.target.value;

    const ward = wards.find(
      (w) => String(w.wardId) === wardId,
    );

    setSelectedWardCode(wardId);

    setFormData({
      ...formData,
      ward: ward?.wardName || "",
    });
  };

  const validatePhone = (phone: string) => {
    const regex = /^[0-9]{10}$/;

    return regex.test(phone);
  };

  const handleFormSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setPhoneError("");

    const payload = {
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone.trim(),
      province: formData.province.trim(),
      district: formData.district.trim(),
      ward: formData.ward.trim(),
      detailAddress: formData.detailAddress.trim(),
    };

    // validate phone
    if (!validatePhone(payload.customerPhone)) {
      setPhoneError("Số điện thoại phải gồm đúng 10 chữ số");

      return;
    }

    let success = false;

    try {
      if (editingAddress) {
        success = await updateAddress(
          editingAddress.addressId,
          payload,
        );

        if (success) {
          const updatedAddress = {
            ...editingAddress,
            ...payload,
          } as CheckoutAddress;

          setSelected(updatedAddress);

          // update selected ngay lập tức
          onSelect(updatedAddress);
        }
      } else {
        success = await addAddress(payload);

        // reload list mới nhất
        if (success) {
          const latestAddresses =
            await addressApi.getAll();

          const newestAddress =
            latestAddresses[latestAddresses.length - 1];

          if (newestAddress) {
            setSelected(newestAddress);

            // render ngay ngoài checkout
            onSelect(newestAddress);
          }
        }
      }

      if (success) {
        setViewMode("list");
      }
    } catch (error) {
      console.error("Submit address failed:", error);
    }
  };

  const handleDelete = async (
    e: React.MouseEvent,
    id: number,
  ) => {
    e.stopPropagation();

    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa địa chỉ này?",
      )
    ) {
      await deleteAddress(id);
    }
  };

  const handleConfirmSelection = () => {
    if (selected) {
      onSelect(selected);

      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="addr-modal__overlay"
      onClick={onClose}
    >
      <div
        className="addr-modal__container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="addr-modal__header">
          {viewMode === "form" && (
            <button
              className="addr-modal__back"
              onClick={() => setViewMode("list")}
            >
              <FiArrowLeft />
            </button>
          )}

          <h3 className="addr-modal__title">
            {viewMode === "list"
              ? "Địa chỉ của tôi"
              : editingAddress
              ? "Cập nhật địa chỉ"
              : "Địa chỉ mới"}
          </h3>

          <button
            className="addr-modal__close"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        <div className="addr-modal__content">
          {viewMode === "list" ? (
            <div className="addr-modal__list-view">
              <div className="addr-modal__list">
                {loading ? (
                  <div className="addr-modal__loading">
                    Đang tải danh sách địa chỉ...
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="addr-modal__empty">
                    Chưa có địa chỉ nào.
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr.addressId}
                      className={`addr-modal__item ${
                        selected?.addressId ===
                        addr.addressId
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSelected(addr)}
                    >
                      <div className="addr-modal__item-info">
                        <div className="addr-modal__item-header">
                          <span>
                            {addr.customerName}
                          </span>

                          <span>|</span>

                          <span>
                            {addr.customerPhone}
                          </span>
                        </div>

                        <div className="addr-modal__item-body">
                          <p>
                            {addr.detailAddress}
                          </p>

                          <p>
                            {addr.ward},{" "}
                            {addr.district},{" "}
                            {addr.province}
                          </p>
                        </div>

                        {addr.isDefault && (
                          <span className="addr-modal__default-badge">
                            Mặc định
                          </span>
                        )}
                      </div>

                      <div className="addr-modal__item-actions">
                        <button
                          className="action-btn edit"
                          onClick={(e) => {
                            e.stopPropagation();

                            handleOpenForm(addr);
                          }}
                        >
                          Cập nhật
                        </button>

                        {!addr.isDefault && (
                          <button
                            className="action-btn delete"
                            onClick={(e) =>
                              handleDelete(
                                e,
                                addr.addressId,
                              )
                            }
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                className="addr-modal__add-new"
                onClick={() => handleOpenForm()}
              >
                <FiPlus />
                Thêm địa chỉ mới
              </button>
            </div>
          ) : (
            <form
              className="addr-modal__form"
              onSubmit={handleFormSubmit}
            >
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerName:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        customerPhone:
                          e.target.value,
                      });

                      setPhoneError("");
                    }}
                  />

                  {phoneError && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "13px",
                        marginTop: "6px",
                      }}
                    >
                      {phoneError}
                    </p>
                  )}
                </div>
              </div>

              {/* Province */}
              <div className="form-group">
                <select
                  required
                  value={selectedProvinceId}
                  onChange={handleProvinceChange}
                >
                  <option value="">
                    Tỉnh/Thành phố
                  </option>

                  {provinces.map((p) => (
                    <option
                      key={p.provinceId}
                      value={p.provinceId}
                    >
                      {p.provinceName}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div className="form-group">
                <select
                  required
                  value={selectedDistrictId}
                  onChange={handleDistrictChange}
                  disabled={!selectedProvinceId}
                >
                  <option value="">
                    Quận/Huyện
                  </option>

                  {districts.map((d) => (
                    <option
                      key={d.districtId}
                      value={d.districtId}
                    >
                      {d.districtName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ward */}
              <div className="form-group">
                <select
                  required
                  value={selectedWardCode}
                  onChange={handleWardChange}
                  disabled={!selectedDistrictId}
                >
                  <option value="">
                    Phường/Xã
                  </option>

                  {wards.map((w) => (
                    <option
                      key={w.wardId}
                      value={w.wardId}
                    >
                      {w.wardName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Detail address */}
              <div className="form-group">
                <textarea
                  placeholder="Địa chỉ cụ thể"
                  required
                  rows={3}
                  value={formData.detailAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      detailAddress:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-back"
                  onClick={() =>
                    setViewMode("list")
                  }
                >
                  Trở lại
                </button>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={submitting}
                >
                  {submitting
                    ? "Đang lưu..."
                    : "Hoàn thành"}
                </button>
              </div>
            </form>
          )}
        </div>

        {viewMode === "list" && (
          <div className="addr-modal__footer">
            <button
              className="btn-cancel"
              onClick={onClose}
            >
              Hủy
            </button>

            <button
              className="btn-confirm"
              onClick={handleConfirmSelection}
              disabled={!selected}
            >
              Xác nhận
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressModal;