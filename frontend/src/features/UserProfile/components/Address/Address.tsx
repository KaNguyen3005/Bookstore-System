import { useEffect, useState } from "react";
import { AddressService } from "../../services/AddressService";
import { LocationService } from "../../services/location.service";
import "../../styles/ManagerAddress.css";

export default function AddressPage() {

  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  useEffect(() => {
    LocationService.getProvinces().then(setProvinces);
  }, []);

  const user_id = 1;

  const fetchData = async () => {
    const data = await AddressService.getAll(user_id);
    setList(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (id: number) => {
    if (!form.customer_name || !form.customer_phone) {
      alert("Nhập thiếu thông tin!");
      return;
    }

    await AddressService.update(id, form);

    setEditingId(null);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa địa chỉ này?")) return;
    await AddressService.remove(id);
    fetchData();
  };

  const handleDefault = async (id: number) => {
    await AddressService.setDefault(id);
    fetchData();
  };

  return (
    <div>
      <h2>Địa chỉ giao hàng</h2>

      <div className="address-list">
        {list.map((item) => (
          <div key={item.address_id} className="address-card">

            {/* DEFAULT */}
            {item.is_default && (
              <div className="default-badge">Mặc định</div>
            )}

            {/* 🔥 EDIT MODE */}
            {editingId === item.address_id ? (
              <>
                <input
                  value={form.customer_name || ""}
                  onChange={e => setForm({ ...form, customer_name: e.target.value })}
                />

                <input
                  value={form.customer_phone || ""}
                  onChange={e => setForm({ ...form, customer_phone: e.target.value })}
                />

                <input
                  placeholder="Số nhà, đường"
                  value={form.detail_address || ""}
                  onChange={e => setForm({ ...form, detail_address: e.target.value })}
                />

                <select
                  value={form.province || ""}
                  onChange={async (e) => {
                    const provinceName = e.target.value;
                    const province = provinces.find(p => p.name === provinceName);

                    setForm({
                      ...form,
                      province: provinceName,
                      district: "",
                      ward: ""
                    });

                    if (province) {
                      const data = await LocationService.getDistricts(province.code);
                      setDistricts(data);
                      setWards([]);
                    }
                  }}
                >
                  <option value="">Chọn tỉnh</option>
                  {provinces.map(p => (
                    <option key={p.code} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <select
                  value={form.district || ""}
                  onChange={async (e) => {
                    const districtName = e.target.value;
                    const district = districts.find(d => d.name === districtName);

                    setForm({
                      ...form,
                      district: districtName,
                      ward: ""
                    });

                    if (district) {
                      const data = await LocationService.getWards(district.code);
                      setWards(data);
                    }
                  }}
                >
                  <option value="">Chọn quận</option>
                  {districts.map(d => (
                    <option key={d.code} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <select
                  value={form.ward || ""}
                  onChange={(e) =>
                    setForm({ ...form, ward: e.target.value })
                  }
                >
                  <option value="">Chọn phường</option>
                  {wards.map(w => (
                    <option key={w.code} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>


                <div className="address-actions"  >
                  <button className="address-btn btn-save"
                    onClick={() => handleSave(item.address_id)}
                  >
                    Lưu
                  </button>

                  <button className="address-btn btn-cancel"
                    onClick={() => setEditingId(null)}
                  >
                    Hủy
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="address-header">
                  {item.customer_name}
                </div>

                <div className="address-info">
                  <div className="address-phone">
                    Số điện thoại: {item.customer_phone}
                  </div>
                  <div>
                    Địa chỉ:  {item.detail_address}, {item.ward}, {item.district}, {item.province}
                  </div>
                </div>

                <div className="address-actions">
                  {!item.is_default && (
                    <button
                      className="address-btn btn-default"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDefault(item.address_id);
                      }}
                    >
                      Đặt mặc định
                    </button>
                  )}

                  <button
                    className="address-btn btn-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(item.address_id);
                      setForm({ ...item });
                    }}
                  >
                    Sửa
                  </button>

                  <button
                    className="address-btn btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.address_id);
                    }}
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