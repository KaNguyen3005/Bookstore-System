import { useEffect, useState } from "react";
import { addressApi } from "../../../../services/addressApi";
import { useAuth } from "../../../../features/auth/hooks/useAuth";
import "./ManagerAddress.css";

export default function AddressPage() {
  const { user } = useAuth();

  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [createForm, setCreateForm] = useState<any>({});
  const [isCreating, setIsCreating] = useState(false);
  const [isSavingCreate, setIsSavingCreate] = useState(false);
  const [createError, setCreateError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [createDistricts, setCreateDistricts] = useState<any[]>([]);
  const [createWards, setCreateWards] = useState<any[]>([]);

  // ================= LOAD PROVINCES =================
  useEffect(() => {
    addressApi.getProvinces().then(setProvinces);
  }, []);

  // ================= LOAD ADDRESSES =================
  const fetchData = async () => {
    const data = await addressApi.getAll();
    setList(data);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const isValidAddressForm = (value: any) =>
    value.customerName &&
    value.customerPhone &&
    value.detailAddress &&
    value.province &&
    value.district &&
    value.ward;

  const normalizeAddressErrorMessage = (
    message: string,
    status?: number,
    fallback = "Không thể xử lý địa chỉ. Vui lòng thử lại."
  ) => {
    const normalizedMessage = message.trim();
    const lowerMessage = normalizedMessage.toLowerCase();

    if (!normalizedMessage) {
      return fallback;
    }

    if (/[^\x00-\x7F]/.test(normalizedMessage)) {
      return normalizedMessage;
    }

    if (lowerMessage.includes("unauthorized") || status === 401) {
      return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    }

    if (lowerMessage.includes("forbidden") || status === 403) {
      return "Bạn không có quyền thực hiện thao tác này.";
    }

    if (lowerMessage.includes("not found") || status === 404) {
      return "Không tìm thấy địa chỉ cần xử lý.";
    }

    if (
      lowerMessage.includes("phone") ||
      lowerMessage.includes("mobile") ||
      lowerMessage.includes("telephone")
    ) {
      return "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.";
    }

    if (lowerMessage.includes("customer") || lowerMessage.includes("name")) {
      return "Tên khách hàng không hợp lệ. Vui lòng kiểm tra lại.";
    }

    if (lowerMessage.includes("province")) {
      return "Tỉnh/thành không hợp lệ. Vui lòng chọn lại.";
    }

    if (lowerMessage.includes("district")) {
      return "Quận/huyện không hợp lệ. Vui lòng chọn lại.";
    }

    if (lowerMessage.includes("ward")) {
      return "Phường/xã không hợp lệ. Vui lòng chọn lại.";
    }

    if (lowerMessage.includes("detail") || lowerMessage.includes("address")) {
      return "Địa chỉ không hợp lệ. Vui lòng kiểm tra lại.";
    }

    if (lowerMessage.includes("bad request") || status === 400) {
      return "Thông tin địa chỉ chưa hợp lệ. Vui lòng kiểm tra lại.";
    }

    if (lowerMessage.includes("network")) {
      return "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.";
    }

    if (status && status >= 500) {
      return "Máy chủ đang gặp lỗi. Vui lòng thử lại sau.";
    }

    return fallback;
  };

  const getErrorMessage = (error: any, fallback: string) => {
    const data = error?.response?.data;
    const status = error?.response?.status;
    const rawMessage =
      typeof data === "string"
        ? data
        : data?.message ||
          data?.error ||
          data?.result?.message ||
          error?.message ||
          "";

    return normalizeAddressErrorMessage(rawMessage, status, fallback);
  };

  // ================= CREATE =================
  const handleCreate = async () => {
    setCreateError("");

    if (!isValidAddressForm(createForm)) {
      setCreateError("Vui lòng nhập đầy đủ thông tin địa chỉ!");
      return;
    }

    try {
      setIsSavingCreate(true);

      await addressApi.create(createForm);

      setCreateForm({});
      setCreateDistricts([]);
      setCreateWards([]);
      setIsCreating(false);
      await fetchData();
    } catch (error) {
      console.error("CREATE ADDRESS ERROR:", error);
      setCreateError(
        getErrorMessage(error, "Không thể thêm địa chỉ. Vui lòng thử lại.")
      );
    } finally {
      setIsSavingCreate(false);
    }
  };

  // ================= SAVE =================
  const handleSave = async (id: number) => {
    if (!isValidAddressForm(form)) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await addressApi.update(id, form);

      setEditingId(null);
      setForm({});
      setDistricts([]);
      setWards([]);
      await fetchData();
    } catch (error) {
      console.error("UPDATE ADDRESS ERROR:", error);
      alert(
        getErrorMessage(error, "Không thể cập nhật địa chỉ. Vui lòng thử lại.")
      );
    }
  };

  const handleStartEdit = async (item: any) => {
    setEditingId(item.addressId);
    setForm({
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      detailAddress: item.detailAddress,
      province: item.province,
      district: item.district,
      ward: item.ward,
    });
    setDistricts([]);
    setWards([]);

    try {
      const provinceOptions =
        provinces.length > 0 ? provinces : await addressApi.getProvinces();

      if (provinces.length === 0) {
        setProvinces(provinceOptions);
      }

      const selectedProvince = provinceOptions.find(
        (province: any) => province.provinceName === item.province
      );

      if (!selectedProvince) return;

      const districtOptions = await addressApi.getDistricts(
        selectedProvince.provinceId
      );
      setDistricts(districtOptions);

      const selectedDistrict = districtOptions.find(
        (district: any) => district.districtName === item.district
      );

      if (!selectedDistrict) return;

      const wardOptions = await addressApi.getWards(
        selectedDistrict.districtId
      );
      setWards(wardOptions);
    } catch (error) {
      console.error("LOAD ADDRESS LOCATION OPTIONS ERROR:", error);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;

    try {
      await addressApi.remove(id);
      await fetchData();
    } catch (error) {
      console.error("DELETE ADDRESS ERROR:", error);
      alert(getErrorMessage(error, "Không thể xóa địa chỉ. Vui lòng thử lại."));
    }
  };

  // ================= SET DEFAULT =================
  const handleDefault = async (id: number) => {
    try {
      await addressApi.setDefault(id);

      await fetchData();

      alert("Đặt địa chỉ mặc định thành công!");
    } catch (error) {
      console.error("SET DEFAULT ADDRESS ERROR:", error);

      alert(
        getErrorMessage(
          error,
          "Không thể đặt địa chỉ mặc định. Vui lòng thử lại."
        )
      );
    }
  };

  return (
    <div className="address-container">
      <h2>Địa chỉ giao hàng</h2>

      {!isCreating ? (
        <button
          className="address-btn btn-add"
          onClick={() => setIsCreating(true)}
        >
          Thêm địa chỉ
        </button>
      ) : (
        <div className="address-card address-create-card">
          <input
            value={createForm.customerName || ""}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                customerName: e.target.value,
              })
            }
            placeholder="Tên khách hàng"
          />

          <input
            value={createForm.customerPhone || ""}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                customerPhone: e.target.value,
              })
            }
            placeholder="Số điện thoại"
          />

          <input
            value={createForm.detailAddress || ""}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                detailAddress: e.target.value,
              })
            }
            placeholder="Địa chỉ chi tiết"
          />

          <select
            value={createForm.province || ""}
            onChange={async (e) => {
              const name = e.target.value;
              const p = provinces.find(
                (x) => x.provinceName === name
              );

              setCreateForm({
                ...createForm,
                province: name,
                district: "",
                ward: "",
              });

              if (p) {
                const data = await addressApi.getDistricts(
                  p.provinceId
                );
                setCreateDistricts(data);
                setCreateWards([]);
              }
            }}
          >
            <option value="">Chọn tỉnh</option>
            {provinces.map((p) => (
              <option
                key={p.provinceId}
                value={p.provinceName}
              >
                {p.provinceName}
              </option>
            ))}
          </select>

          <select
            value={createForm.district || ""}
            onChange={async (e) => {
              const name = e.target.value;
              const d = createDistricts.find(
                (x) => x.districtName === name
              );

              setCreateForm({
                ...createForm,
                district: name,
                ward: "",
              });

              if (d) {
                const data = await addressApi.getWards(
                  d.districtId
                );
                setCreateWards(data);
              }
            }}
          >
            <option value="">Chọn quận/huyện</option>
            {createDistricts.map((d) => (
              <option
                key={d.districtId}
                value={d.districtName}
              >
                {d.districtName}
              </option>
            ))}
          </select>

          <select
            value={createForm.ward || ""}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                ward: e.target.value,
              })
            }
          >
            <option value="">Chọn phường/xã</option>
            {createWards.map((w) => (
              <option
                key={w.wardId}
                value={w.wardName}
              >
                {w.wardName}
              </option>
            ))}
          </select>

          <div className="address-actions">
            <button
              className="address-btn btn-save"
              onClick={handleCreate}
              disabled={isSavingCreate}
            >
              {isSavingCreate ? "Đang lưu..." : "Lưu địa chỉ"}
            </button>

            <button
              className="address-btn btn-cancel"
              onClick={() => {
                setIsCreating(false);
                setCreateForm({});
                setCreateDistricts([]);
                setCreateWards([]);
                setCreateError("");
              }}
              disabled={isSavingCreate}
            >
              Hủy
            </button>
          </div>

          {createError && (
            <div className="address-error" role="alert">
              {createError}
            </div>
          )}
        </div>
      )}

      <div className="address-list">
        {list.map((item) => (
          <div key={item.addressId} className="address-card">

            {/* DEFAULT BADGE */}
            {item.isDefault && (
              <div className="default-badge">Mặc định</div>
            )}

            {/* ================= EDIT MODE ================= */}
            {editingId === item.addressId ? (
              <>
                <input
                  value={form.customerName || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customerName: e.target.value,
                    })
                  }
                  placeholder="Tên khách hàng"
                />

                <input
                  value={form.customerPhone || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customerPhone: e.target.value,
                    })
                  }
                  placeholder="Số điện thoại"
                />

                <input
                  value={form.detailAddress || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      detailAddress: e.target.value,
                    })
                  }
                  placeholder="Địa chỉ chi tiết"
                />

                {/* PROVINCE */}
                <select
                  value={form.province || ""}
                  onChange={async (e) => {
                    const name = e.target.value;
                    const p = provinces.find(
                      (x) => x.provinceName === name
                    );

                    setForm({
                      ...form,
                      province: name,
                      district: "",
                      ward: "",
                    });

                    if (p) {
                      const data =
                        await addressApi.getDistricts(
                          p.provinceId
                        );
                      setDistricts(data);
                      setWards([]);
                    } else {
                      setDistricts([]);
                      setWards([]);
                    }
                  }}
                >
                  <option value="">Chọn tỉnh</option>
                  {provinces.map((p) => (
                    <option
                      key={p.provinceId}
                      value={p.provinceName}
                    >
                      {p.provinceName}
                    </option>
                  ))}
                </select>

                {/* DISTRICT */}
                <select
                  value={form.district || ""}
                  onChange={async (e) => {
                    const name = e.target.value;
                    const d = districts.find(
                      (x) => x.districtName === name
                    );

                    setForm({
                      ...form,
                      district: name,
                      ward: "",
                    });

                    if (d) {
                      const data =
                        await addressApi.getWards(
                          d.districtId
                        );
                      setWards(data);
                    }
                  }}
                >
                  <option value="">Chọn quận</option>
                  {districts.map((d) => (
                    <option
                      key={d.districtId}
                      value={d.districtName}
                    >
                      {d.districtName}
                    </option>
                  ))}
                </select>

                {/* WARD */}
                <select
                  value={form.ward || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ward: e.target.value,
                    })
                  }
                >
                  <option value="">Chọn phường</option>
                  {wards.map((w) => (
                    <option
                      key={w.wardId}
                      value={w.wardName}
                    >
                      {w.wardName}
                    </option>
                  ))}
                </select>

                {/* ACTIONS */}
                <div className="address-actions">
                  <button
                    className="address-btn btn-save"
                    onClick={() =>
                      handleSave(item.addressId)
                    }
                  >
                    Lưu
                  </button>

                  <button
                    className="address-btn btn-cancel"
                    onClick={() => {
                      setEditingId(null);
                      setForm({});
                      setDistricts([]);
                      setWards([]);
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* VIEW MODE */}
                <div className="address-name">
                  {item.customerName}
                </div>

                <div className="address-info">
                  <div>
                    SĐT: {item.customerPhone}
                  </div>

                  <div>
                    {item.detailAddress},{" "}
                    {item.ward}, {item.district},{" "}
                    {item.province}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="address-actions">
                  {!item.isDefault && (
                    <button
                      className="address-btn btn-default"
                      onClick={() =>
                        handleDefault(item.addressId)
                      }
                    >
                      Đặt mặc định
                    </button>
                  )}

                  <button
                    className="address-btn btn-edit"
                    onClick={() => {
                      void handleStartEdit(item);
                    }}
                  >
                    Sửa
                  </button>

                  <button
                    className="address-btn btn-delete"
                    onClick={() =>
                      handleDelete(item.addressId)
                    }
                  >
                    Xóa
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
