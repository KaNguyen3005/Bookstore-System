import {
  Building2,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  usePublisherManagement,
} from "../hooks/usePublisherManagement";

import "./PublisherManagement.css";

export default function PublisherManagement() {
  const {
    editingPublisher,
    error,
    formData,
    formError,
    handleDelete,
    handleEdit,
    handleOpenCreate,
    handleSubmit,
    isFormOpen,
    loading,
    query,
    resetForm,
    saving,
    selectedPublisher,
    setFormData,
    setFormError,
    setQuery,
    setSelectedPublisher,
    stats,
    visiblePublishers,
  } = usePublisherManagement();

  return (
    <div className="publisher-management">
      <div className="publisher-management__header">
        <div>
          <h2>QUẢN LÝ NHÀ XUẤT BẢN</h2>
          <p>Quản lý thông tin nhà xuất bản trong hệ thống</p>
        </div>

        <button
          className="publisher-management__btn publisher-management__btn--primary"
          onClick={handleOpenCreate}
          type="button"
        >
          <Plus size={16} />
          Thêm nhà xuất bản
        </button>
      </div>

      <div className="publisher-management__stats">
        <div>
          <span>Tổng nhà xuất bản</span>
          <strong>{stats.total}</strong>
        </div>
        <div>
          <span>Đang hiển thị</span>
          <strong>{stats.visible}</strong>
        </div>
      </div>

      {error && <div className="publisher-management__error">{error}</div>}

      <div className="publisher-management__toolbar">
        <label className="publisher-management__search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo tên hoặc mã nhà xuất bản"
          />
        </label>
      </div>

      <div className="publisher-management__table-card">
        <div className="publisher-management__table-title">
          <Building2 size={18} />
          <h3>Danh sách nhà xuất bản</h3>
        </div>

        {loading ? (
          <div className="publisher-management__empty">
            Đang tải nhà xuất bản...
          </div>
        ) : (
          <div className="publisher-management__table-wrap">
            <table className="publisher-management__table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tên nhà xuất bản</th>
                  <th>Trạng thái</th>
                  <th>Quản lý</th>
                </tr>
              </thead>

              <tbody>
                {visiblePublishers.length > 0 ? (
                  visiblePublishers.map((publisher) => (
                      <tr key={String(publisher.publisherId)}>
                        <td>{String(publisher.publisherId)}</td>
                        <td>
                          {publisher.publisherName}
                        </td>
                        <td>
                          <span className="publisher-management__status">
                            Hoạt động
                          </span>
                        </td>
                        <td>
                          <div className="publisher-management__actions">
                            <button
                              type="button"
                              onClick={() => setSelectedPublisher(publisher)}
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEdit(publisher)}
                              title="Sửa nhà xuất bản"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(publisher)}
                              title="Xóa nhà xuất bản"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={4} className="publisher-management__empty">
                      Không tìm thấy nhà xuất bản phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedPublisher && (
        <div className="publisher-management__modal">
          <div
            className="publisher-management__modal-overlay"
            onClick={() => setSelectedPublisher(null)}
          />
          <div className="publisher-management__modal-content">
            <div className="publisher-management__modal-header">
              <div>
                <h3>Chi tiết nhà xuất bản</h3>
                <p>{selectedPublisher.publisherName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPublisher(null)}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            <div className="publisher-management__modal-body">
              <div>
                <span>Mã nhà xuất bản</span>
                <strong>{String(selectedPublisher.publisherId)}</strong>
              </div>
              <div>
                <span>Tên nhà xuất bản</span>
                <strong>{selectedPublisher.publisherName}</strong>
              </div>
              <div>
                <span>Trạng thái</span>
                <strong>Hoạt động</strong>
              </div>
            </div>

            <div className="publisher-management__modal-footer">
              <button
                type="button"
                className="publisher-management__btn publisher-management__btn--ghost"
                onClick={() => setSelectedPublisher(null)}
              >
                Đóng
              </button>
              <button
                type="button"
                className="publisher-management__btn publisher-management__btn--primary"
                onClick={() => handleEdit(selectedPublisher)}
              >
                <Pencil size={16} />
                Sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="publisher-management__modal">
          <div className="publisher-management__modal-overlay" onClick={resetForm} />
          <form
            className="publisher-management__modal-content"
            onSubmit={handleSubmit}
          >
            <div className="publisher-management__modal-header">
              <div>
                <h3>
                  {editingPublisher
                    ? "Cập nhật nhà xuất bản"
                    : "Thêm nhà xuất bản"}
                </h3>
                <p>
                  {editingPublisher?.publisherName ?? "Nhà xuất bản mới"}
                </p>
              </div>
              <button type="button" onClick={resetForm} aria-label="Đóng">
                <X size={18} />
              </button>
            </div>

            <div className="publisher-management__modal-body">
              <label className="publisher-management__field">
                <span>Tên nhà xuất bản</span>
                <input
                  value={formData.publisherName}
                  onChange={(event) => {
                    setFormData({
                      publisherName: event.target.value,
                    });
                    setFormError(null);
                  }}
                  placeholder="Nhập tên nhà xuất bản"
                  autoFocus
                />
              </label>

              {formError && (
                <div className="publisher-management__form-error">
                  {formError}
                </div>
              )}
            </div>

            <div className="publisher-management__modal-footer">
              <button
                type="button"
                className="publisher-management__btn publisher-management__btn--ghost"
                onClick={resetForm}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="publisher-management__btn publisher-management__btn--primary"
                disabled={saving}
              >
                {saving ? "Đang lưu..." : editingPublisher ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
