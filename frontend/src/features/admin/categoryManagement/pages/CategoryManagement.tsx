import {
  ChevronRight,
  Eye,
  FolderOpen,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  getCategoryDeleted,
  useCategoryManagement,
  type StatusFilter,
} from "../hooks/useCategoryManagement";

import "./CategoryManagement.css";

export default function CategoryManagement() {
  const {
    editingCategory,
    error,
    formData,
    formError,
    handleDelete,
    handleEdit,
    handleOpenCreate,
    handleRestore,
    handleSubmit,
    isFormOpen,
    loading,
    parentOptions,
    query,
    resetForm,
    saving,
    selectedCategory,
    setFormData,
    setQuery,
    setSelectedCategory,
    setStatusFilter,
    stats,
    statusFilter,
    visibleGroups,
  } = useCategoryManagement();

  return (
    <div className="category-management">
      <div className="category-management__header">
        <div>
          <h2>QUẢN LÝ DANH MỤC</h2>
          <p>Quản lý danh mục sách trong hệ thống</p>
        </div>

        <div className="category-management__header-actions">
          <button
            className="category-management__btn category-management__btn--primary"
            onClick={handleOpenCreate}
            type="button"
          >
            <Plus size={16} />
            Thêm danh mục
          </button>
        </div>
      </div>

      <div className="category-management__stats">
        <div>
          <span>Tổng danh mục</span>
          <strong>{stats.total}</strong>
        </div>
        <div>
          <span>Danh mục gốc</span>
          <strong>{stats.root}</strong>
        </div>
        <div>
          <span>Danh mục con</span>
          <strong>{stats.child}</strong>
        </div>
      </div>

      {error && <div className="category-management__error">{error}</div>}

      <div className="category-management__toolbar">
        <label className="category-management__search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo tên hoặc mã danh mục"
          />
        </label>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hoạt động</option>
          <option value="DELETED">Đã xóa</option>
        </select>
      </div>

      <div className="category-management__tree-board">
        {loading ? (
          <div className="category-management__empty">Đang tải danh mục...</div>
        ) : visibleGroups.length > 0 ? (
          visibleGroups.map(({ parent, children }) => {
            const parentDeleted = getCategoryDeleted(parent);
            const activeChildren = children.filter((child) => !getCategoryDeleted(child));

            return (
              <section
                key={String(parent.categoryId)}
                className={`category-management__group ${
                  parentDeleted ? "category-management__group--deleted" : ""
                }`}
              >
                <div className="category-management__group-header">
                  <div className="category-management__parent-main">
                    <span className="category-management__folder-icon">
                      <FolderOpen size={22} />
                    </span>

                    <div className="category-management__parent-info">
                      <div className="category-management__parent-title">
                        <h3>{parent.categoryName}</h3>
                        <span
                          className={`category-management__status ${
                            parentDeleted
                              ? "category-management__status--deleted"
                              : "category-management__status--active"
                          }`}
                        >
                          {parentDeleted ? "Đã xóa" : "Hoạt động"}
                        </span>
                      </div>

                      <p>
                        Mã {String(parent.categoryId)} · {children.length} danh mục con ·{" "}
                        {activeChildren.length} đang hoạt động
                      </p>
                    </div>
                  </div>

                  <div className="category-management__actions">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(parent)}
                      title="Xem chi tiết"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(parent)}
                      title="Sửa danh mục"
                      disabled={parentDeleted}
                    >
                      <Pencil size={16} />
                    </button>
                    {parentDeleted ? (
                      <button
                        type="button"
                        onClick={() => handleRestore(parent.categoryId)}
                        title="Khôi phục"
                      >
                        <RotateCcw size={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDelete(parent)}
                        title="Xóa danh mục"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="category-management__children-list">
                  {children.length > 0 ? (
                    children.map((category) => {
                      const deleted = getCategoryDeleted(category);

                      return (
                        <div
                          key={String(category.categoryId)}
                          className={`category-management__child-row ${
                            deleted ? "category-management__child-row--deleted" : ""
                          }`}
                          style={{ marginLeft: `${Math.max(category.level - 1, 0) * 18}px` }}
                        >
                          <span className="category-management__child-branch">
                            <ChevronRight size={16} />
                          </span>

                          <div className="category-management__child-info">
                            <strong>{category.categoryName}</strong>
                            <span>
                              Mã {String(category.categoryId)} · Cấp {category.level + 1}
                            </span>
                          </div>

                          <span
                            className={`category-management__status ${
                              deleted
                                ? "category-management__status--deleted"
                                : "category-management__status--active"
                            }`}
                          >
                            {deleted ? "Đã xóa" : "Hoạt động"}
                          </span>

                          <div className="category-management__actions">
                          <button
                            type="button"
                            onClick={() => setSelectedCategory(category)}
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(category)}
                            title="Sửa danh mục"
                            disabled={deleted}
                          >
                            <Pencil size={16} />
                          </button>
                          {deleted ? (
                            <button
                              type="button"
                              onClick={() => handleRestore(category.categoryId)}
                              title="Khôi phục"
                            >
                              <RotateCcw size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDelete(category)}
                              title="Xóa danh mục"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="category-management__empty category-management__empty--children">
                      Chưa có danh mục con
                    </div>
                  )}
                </div>
              </section>
            );
          })
        ) : (
          <div className="category-management__empty">
            Không tìm thấy danh mục phù hợp
          </div>
        )}
      </div>

      {selectedCategory && (
        <div className="category-management__modal">
          <div
            className="category-management__modal-overlay"
            onClick={() => setSelectedCategory(null)}
          />
          <div className="category-management__modal-content">
            <div className="category-management__modal-header">
              <div>
                <h3>Chi tiết danh mục</h3>
                <p>{selectedCategory.categoryName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            <div className="category-management__modal-body">
              <div>
                <span>Mã danh mục</span>
                <strong>{String(selectedCategory.categoryId)}</strong>
              </div>
              <div>
                <span>Tên danh mục</span>
                <strong>{selectedCategory.categoryName}</strong>
              </div>
              <div>
                <span>Danh mục cha</span>
                <strong>{selectedCategory.parentName || "Danh mục gốc"}</strong>
              </div>
              <div>
                <span>Số danh mục con</span>
                <strong>{selectedCategory.children?.length ?? 0}</strong>
              </div>
              <div>
                <span>Trạng thái</span>
                <strong>
                  {getCategoryDeleted(selectedCategory) ? "Đã xóa" : "Hoạt động"}
                </strong>
              </div>
            </div>

            <div className="category-management__modal-footer">
              <button
                type="button"
                className="category-management__btn category-management__btn--ghost"
                onClick={() => setSelectedCategory(null)}
              >
                Đóng
              </button>
              {!getCategoryDeleted(selectedCategory) && (
                <button
                  type="button"
                  className="category-management__btn category-management__btn--primary"
                  onClick={() => handleEdit(selectedCategory)}
                >
                  <Pencil size={16} />
                  Sửa danh mục
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="category-management__modal">
          <div className="category-management__modal-overlay" onClick={resetForm} />
          <form
            className="category-management__modal-content"
            onSubmit={handleSubmit}
          >
            <div className="category-management__modal-header">
              <div>
                <h3>{editingCategory ? "Cập nhật danh mục" : "Thêm danh mục"}</h3>
                <p>{editingCategory?.categoryName ?? "Danh mục mới"}</p>
              </div>
              <button type="button" onClick={resetForm} aria-label="Đóng">
                <X size={18} />
              </button>
            </div>

            <div className="category-management__modal-body">
              <label className="category-management__field">
                <span>Tên danh mục</span>
                <input
                  value={formData.categoryName}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      categoryName: event.target.value,
                    }))
                  }
                  placeholder="Nhập tên danh mục"
                  autoFocus
                />
              </label>

              <label className="category-management__field">
                <span>Danh mục cha</span>
                <select
                  value={String(formData.parentCategoryId ?? "")}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      parentCategoryId: event.target.value || null,
                    }))
                  }
                >
                  <option value="">Không có</option>
                  {parentOptions.map((category) => (
                    <option
                      key={String(category.categoryId)}
                      value={String(category.categoryId)}
                    >
                      {"— ".repeat(category.level)}
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </label>

              {formError && (
                <div className="category-management__form-error">{formError}</div>
              )}
            </div>

            <div className="category-management__modal-footer">
              <button
                type="button"
                className="category-management__btn category-management__btn--ghost"
                onClick={resetForm}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="category-management__btn category-management__btn--primary"
                disabled={saving}
              >
                {saving ? "Đang lưu..." : editingCategory ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
