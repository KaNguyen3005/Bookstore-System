import { useEffect, useState, type FormEvent } from "react";
import "./AuthorManagement.css";

import {
  createAuthor,
  deleteAuthor,
  getAuthors,
  updateAuthor,
  type Author,
  type AuthorPayload,
} from "../../../../services/authorApi";

const emptyForm: AuthorPayload = {
  authorName: "",
  alias: "",
};

export default function AuthorManagement() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [formData, setFormData] = useState<AuthorPayload>(emptyForm);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAuthors = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAuthors();

      setAuthors(data);
    } catch (err) {
      console.error("Load authors failed:", err);
      setError("Không thể tải danh sách tác giả");
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingAuthor(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const authorName = formData.authorName.trim();
    const alias = formData.alias.trim();

    if (!authorName || !alias) {
      setError("Vui lòng nhập đầy đủ tên tác giả và bí danh");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = { authorName, alias };

      if (editingAuthor) {
        await updateAuthor(editingAuthor.authorId, payload);
      } else {
        await createAuthor(payload);
      }

      resetForm();
      await loadAuthors();
    } catch (err) {
      console.error("Save author failed:", err);
      setError("Không thể lưu thông tin tác giả");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (author: Author) => {
    setSelectedAuthor(null);
    setEditingAuthor(author);
    setIsFormOpen(true);
    setFormData({
      authorName: author.authorName,
      alias: author.alias,
    });
  };

  const handleOpenCreate = () => {
    setEditingAuthor(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const handleDelete = async (author: Author) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa tác giả "${author.authorName}"?`,
    );

    if (!confirmed) return;

    setError(null);

    try {
      await deleteAuthor(author.authorId);
      await loadAuthors();
    } catch (err) {
      console.error("Delete author failed:", err);
      setError("Không thể xóa tác giả");
    }
  };

  return (
    <div className="author-management">
      <div className="author-management__header">
        <div>
          <h2>QUẢN LÝ THÔNG TIN TÁC GIẢ</h2>
        </div>

        <button className="btn edit" onClick={handleOpenCreate}>
          Thêm tác giả
        </button>
      </div>

      <div className="author-management__summary">
        <h3 className="author-management__summary-title">Tổng số tác giả</h3>
        <p>{authors.length}</p>
      </div>

      {error && <div className="author-management__error">{error}</div>}

      <div className="table-wrapper">
        <h2>Danh sách</h2>

        {loading ? (
          <div className="author-management__empty">Đang tải tác giả...</div>
        ) : (
          <table className="customer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên tác giả</th>
                <th>Bí danh</th>
                <th>Quản lý</th>
              </tr>
            </thead>

            <tbody>
              {authors.length > 0 ? (
                authors.map((author) => (
                  <tr key={author.authorId}>
                    <td>{author.authorId}</td>
                    <td>{author.authorName}</td>
                    <td>{author.alias}</td>
                    <td>
                      <button
                        className="btn edit"
                        onClick={() => handleEdit(author)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn delete"
                        onClick={() => handleDelete(author)}
                      >
                        Xóa
                      </button>
                      <button
                        className="btn view"
                        onClick={() => setSelectedAuthor(author)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="author-management__empty">
                    Chưa có tác giả nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedAuthor && (
        <div className="author-detail-modal">
          <div
            className="author-detail-modal__overlay"
            onClick={() => setSelectedAuthor(null)}
          />

          <div className="author-detail-modal__content">
            <div className="author-detail-modal__header">
              <div>
                <h3>Chi tiết tác giả</h3>
                <p>{selectedAuthor.authorName}</p>
              </div>

              <button
                className="author-detail-modal__close"
                onClick={() => setSelectedAuthor(null)}
                aria-label="Đóng"
              >
                ×
              </button>
            </div>

            <div className="author-detail-modal__body">
              <div className="author-detail-modal__row">
                <span>ID</span>
                <strong>{selectedAuthor.authorId}</strong>
              </div>

              <div className="author-detail-modal__row">
                <span>Tên tác giả</span>
                <strong>{selectedAuthor.authorName || "Chưa cập nhật"}</strong>
              </div>

              <div className="author-detail-modal__row">
                <span>Bí danh</span>
                <strong>{selectedAuthor.alias || "Chưa cập nhật"}</strong>
              </div>

              <div className="author-detail-modal__row">
                <span>Ngày tạo</span>
                <strong>
                  {selectedAuthor.createdAt
                    ? new Date(selectedAuthor.createdAt).toLocaleString("vi-VN")
                    : "Chưa có dữ liệu"}
                </strong>
              </div>

              <div className="author-detail-modal__row">
                <span>Cập nhật lần cuối</span>
                <strong>
                  {selectedAuthor.updatedAt
                    ? new Date(selectedAuthor.updatedAt).toLocaleString("vi-VN")
                    : "Chưa có dữ liệu"}
                </strong>
              </div>
            </div>

            <div className="author-detail-modal__footer">
              <button
                className="btn view"
                onClick={() => setSelectedAuthor(null)}
              >
                Đóng
              </button>

              <button
                className="btn edit"
                onClick={() => handleEdit(selectedAuthor)}
              >
                Sửa tác giả
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="author-form-modal">
          <div className="author-form-modal__overlay" onClick={resetForm} />

          <form className="author-form-modal__content" onSubmit={handleSubmit}>
            <div className="author-form-modal__header">
              <div>
                <h3>{editingAuthor ? "Cập nhật tác giả" : "Thêm tác giả"}</h3>
                <p>
                  {editingAuthor
                    ? "Chỉnh sửa thông tin tác giả trong hệ thống"
                    : "Tạo mới tác giả để sử dụng khi thêm sách"}
                </p>
              </div>

              <button
                type="button"
                className="author-form-modal__close"
                onClick={resetForm}
                aria-label="Đóng"
              >
                ×
              </button>
            </div>

            <div className="author-form-modal__body">
              <label>
                <span>Tên tác giả</span>
                <input
                  value={formData.authorName}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      authorName: event.target.value,
                    }))
                  }
                  placeholder="Nhập tên tác giả"
                  autoFocus
                />
              </label>

              <label>
                <span>Bí danh</span>
                <input
                  value={formData.alias}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      alias: event.target.value,
                    }))
                  }
                  placeholder="Nhập bí danh"
                />
              </label>
            </div>

            <div className="author-form-modal__footer">
              <button type="button" className="btn view" onClick={resetForm}>
                Hủy
              </button>

              <button type="submit" className="btn edit" disabled={saving}>
                {saving
                  ? "Đang lưu..."
                  : editingAuthor
                  ? "Cập nhật"
                  : "Thêm tác giả"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
