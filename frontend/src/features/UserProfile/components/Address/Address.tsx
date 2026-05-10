import { useEffect, useState } from "react";
import { addressApi } from "../../../../services/addressApi";
import { useAuth } from "../../../../features/auth/hooks/useAuth";
import "./ManagerAddress.css";

export default function AddressPage() {
  const { user } = useAuth();

  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

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

  // ================= SAVE =================
  const handleSave = async (id: number) => {
    if (!form.customerName || !form.customerPhone) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    await addressApi.update(id, form);

    setEditingId(null);
    setForm({});
    fetchData();
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;

    await addressApi.remove(id);
    fetchData();
  };

  // ================= SET DEFAULT =================
  const handleDefault = async (id: number) => {
    await addressApi.setDefault(id);
    fetchData();
  };

  return (
    <div className="address-container">
      <h2>Địa chỉ giao hàng</h2>

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
                      setEditingId(item.addressId);
                      setForm({
                        customerName:
                          item.customerName,
                        customerPhone:
                          item.customerPhone,
                        detailAddress:
                          item.detailAddress,
                        province: item.province,
                        district: item.district,
                        ward: item.ward,
                      });
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