import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

import type { Category } from "../../../book-category/types/category";
import {
  categoryService,
  type CategoryId,
  type CategoryPayload,
} from "../../../book-category/services/categoryService";

export type CategoryRow = Category & {
  level: number;
  parentName?: string;
  deletedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  isDeleted?: boolean;
  deleted?: boolean;
};

export type StatusFilter = "ALL" | "ACTIVE" | "DELETED";
const emptyForm: CategoryPayload = {
  categoryName: "",
  parentCategoryId: null,
};

const hasCategoryParent = (parentCategoryId: CategoryId | null | undefined) => {
  return (
    parentCategoryId !== null &&
    parentCategoryId !== undefined &&
    String(parentCategoryId) !== ""
  );
};

export const getCategoryDeleted = (category: CategoryRow) => {
  return Boolean(category.deletedAt || category.isDeleted || category.deleted);
};

type CategoryWithApiFields = Category & {
  id?: CategoryId;
  name?: string;
  parentId?: CategoryId | null;
};

const flattenCategories = (categories: Category[]): CategoryRow[] => {
  const rowsById = new Map<string, CategoryRow>();
  const orderedIds: string[] = [];

  const collectCategory = (
    category: Category,
    parentId: CategoryId | null = null,
  ) => {
    const rawCategory = category as CategoryWithApiFields;
    const categoryId = rawCategory.categoryId ?? rawCategory.id;

    if (categoryId === undefined || categoryId === null) return;

    const rowKey = String(categoryId);
    const categoryName = rawCategory.categoryName ?? rawCategory.name ?? "";
    const parentCategoryId =
      rawCategory.parentCategoryId ?? rawCategory.parentId ?? parentId;
    const children = Array.isArray(rawCategory.children)
      ? rawCategory.children
      : [];

    if (!rowsById.has(rowKey)) {
      orderedIds.push(rowKey);
    }

    rowsById.set(rowKey, {
      ...rawCategory,
      categoryId,
      categoryName,
      parentCategoryId: parentCategoryId ?? null,
      children,
      level: 0,
      parentName: "",
    });

    children.forEach((child) => collectCategory(child, categoryId));
  };

  categories.forEach((category) => collectCategory(category));

  const childIdsByParentId = new Map<string, string[]>();

  orderedIds.forEach((rowKey) => {
    const row = rowsById.get(rowKey);

    if (!row || !hasCategoryParent(row.parentCategoryId)) return;

    const parentKey = String(row.parentCategoryId);
    const currentIds = childIdsByParentId.get(parentKey) ?? [];

    childIdsByParentId.set(parentKey, [...currentIds, rowKey]);
  });

  const normalizedRows: CategoryRow[] = [];
  const visitedIds = new Set<string>();

  const appendRow = (rowKey: string, level: number, parentName = "") => {
    if (visitedIds.has(rowKey)) return;

    const row = rowsById.get(rowKey);

    if (!row) return;

    visitedIds.add(rowKey);

    const childIds = childIdsByParentId.get(rowKey) ?? [];
    const children = childIds
      .map((childId) => rowsById.get(childId))
      .filter((child): child is CategoryRow => Boolean(child));
    const normalizedRow: CategoryRow = {
      ...row,
      level,
      parentName,
      children,
    };

    normalizedRows.push(normalizedRow);

    childIds.forEach((childId) =>
      appendRow(childId, level + 1, normalizedRow.categoryName),
    );
  };

  orderedIds
    .filter((rowKey) => {
      const row = rowsById.get(rowKey);

      return (
        !row ||
        !hasCategoryParent(row.parentCategoryId) ||
        !rowsById.has(String(row.parentCategoryId))
      );
    })
    .forEach((rowKey) => appendRow(rowKey, 0));

  orderedIds.forEach((rowKey) => appendRow(rowKey, 0));

  return normalizedRows;
};

const matchesStatus = (category: CategoryRow, statusFilter: StatusFilter) => {
  const deleted = getCategoryDeleted(category);

  return (
    statusFilter === "ALL" ||
    (statusFilter === "ACTIVE" && !deleted) ||
    (statusFilter === "DELETED" && deleted)
  );
};

const matchesKeyword = (category: CategoryRow, keyword: string) => {
  return (
    !keyword ||
    category.categoryName.toLowerCase().includes(keyword) ||
    String(category.categoryId).toLowerCase().includes(keyword)
  );
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };

  return (
    apiError.response?.data?.message ??
    apiError.response?.data?.error ??
    apiError.message ??
    fallback
  );
};

export const useCategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [formData, setFormData] = useState<CategoryPayload>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryRow | null>(
    null,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);

  const rows = useMemo(() => flattenCategories(categories), [categories]);

  const parentOptions = useMemo(() => {
    return rows.filter((row) => {
      if (getCategoryDeleted(row)) return false;
      if (!editingCategory) return true;

      return String(row.categoryId) !== String(editingCategory.categoryId);
    });
  }, [editingCategory, rows]);

  const childRowsByParentId = useMemo(() => {
    const map = new Map<string, CategoryRow[]>();

    rows.forEach((row) => {
      if (!hasCategoryParent(row.parentCategoryId)) return;

      const key = String(row.parentCategoryId);
      const currentRows = map.get(key) ?? [];

      map.set(key, [...currentRows, row]);
    });

    return map;
  }, [rows]);

  const visibleGroups = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const rootRows = rows.filter((row) => row.level === 0);
    const collectDescendants = (
      parentId: CategoryId,
      visitedIds = new Set<string>(),
    ): CategoryRow[] => {
      const parentKey = String(parentId);

      if (visitedIds.has(parentKey)) return [];

      const nextVisitedIds = new Set(visitedIds);

      nextVisitedIds.add(parentKey);

      const directChildren = childRowsByParentId.get(String(parentId)) ?? [];

      return directChildren.flatMap((child) => [
        child,
        ...collectDescendants(child.categoryId, nextVisitedIds),
      ]);
    };

    return rootRows
      .map((parent) => {
        const directChildren = collectDescendants(parent.categoryId);
        const parentMatches =
          matchesKeyword(parent, keyword) && matchesStatus(parent, statusFilter);
        const visibleChildren = directChildren.filter((child) => {
          if (!matchesStatus(child, statusFilter)) return false;
          if (parentMatches && keyword) return true;

          return matchesKeyword(child, keyword);
        });

        return {
          parent,
          children:
            parentMatches && !keyword
              ? directChildren.filter((child) =>
                  matchesStatus(child, statusFilter),
                )
              : visibleChildren,
          parentMatches,
        };
      })
      .filter((group) => group.parentMatches || group.children.length > 0);
  }, [childRowsByParentId, query, rows, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: rows.length,
      root: rows.filter((row) => row.level === 0).length,
      child: rows.filter((row) => row.level > 0).length,
    };
  }, [rows]);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await categoryService.getCategories();

      setCategories(data);
    } catch (err) {
      console.error("Load categories failed:", err);
      setError(getErrorMessage(err, "Không thể tải danh sách danh mục"));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const resetForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setFormData(emptyForm);
    setFormError(null);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setSelectedCategory(null);
    setEditingCategory(null);
    setFormData(emptyForm);
    setFormError(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((category: CategoryRow) => {
    setSelectedCategory(null);
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName,
      parentCategoryId: category.parentCategoryId ?? null,
    });
    setFormError(null);
    setIsFormOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const categoryName = formData.categoryName.trim();

      if (!categoryName) {
        setFormError("Vui lòng nhập tên danh mục");
        return;
      }

      if (
        editingCategory &&
        formData.parentCategoryId &&
        String(formData.parentCategoryId) === String(editingCategory.categoryId)
      ) {
        setFormError("Danh mục cha không được trùng với chính nó");
        return;
      }

      setSaving(true);
      setFormError(null);
      setError(null);

      try {
        const payload = {
          categoryName,
          parentCategoryId: formData.parentCategoryId || null,
        };

        if (editingCategory) {
          await categoryService.updateCategory(
            editingCategory.categoryId,
            payload,
          );
        } else {
          await categoryService.createCategory(payload);
        }

        resetForm();
        await loadCategories();
      } catch (err) {
        console.error("Save category failed:", err);
        setFormError(getErrorMessage(err, "Không thể lưu danh mục"));
      } finally {
        setSaving(false);
      }
    },
    [editingCategory, formData, loadCategories, resetForm],
  );

  const handleDelete = useCallback(
    async (category: CategoryRow) => {
      const confirmed = window.confirm(
        `Bạn có chắc muốn xóa danh mục "${category.categoryName}"?`,
      );

      if (!confirmed) return;

      setError(null);

      try {
        await categoryService.deleteCategory(category.categoryId);
        await loadCategories();
      } catch (err) {
        console.error("Delete category failed:", err);
        setError(getErrorMessage(err, "Không thể xóa danh mục"));
      }
    },
    [loadCategories],
  );

  const handleRestore = useCallback(
    async (id: CategoryId) => {
      setError(null);

      try {
        await categoryService.restoreCategory(id);
        await loadCategories();
      } catch (err) {
        console.error("Restore category failed:", err);
        setError(getErrorMessage(err, "Không thể khôi phục danh mục"));
      }
    },
    [loadCategories],
  );

  return {
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
    loadCategories,
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
  };
};
