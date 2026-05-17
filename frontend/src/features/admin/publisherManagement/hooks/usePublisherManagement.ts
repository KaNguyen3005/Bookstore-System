import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useToast } from "../../../../shared/components/Toast/ToastProvider";

import type { Publisher } from "../../../book-category/types/category";
import {
  publisherService,
  type PublisherPayload,
} from "../../../book-category/services/publisherService";

const emptyForm: PublisherPayload = {
  publisherName: "",
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

export const usePublisherManagement = () => {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [formData, setFormData] = useState<PublisherPayload>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(
    null,
  );
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(
    null,
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { showToast } = useToast();

  const visiblePublishers = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) return publishers;

    return publishers.filter((publisher) => {
      return (
        publisher.publisherName.toLowerCase().includes(keyword) ||
        String(publisher.publisherId).toLowerCase().includes(keyword)
      );
    });
  }, [publishers, query]);

  const stats = useMemo(() => {
    return {
      total: publishers.length,
      visible: visiblePublishers.length,
    };
  }, [publishers.length, visiblePublishers.length]);

  const loadPublishers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await publisherService.getPublishers();

      setPublishers(data);
    } catch (err) {
      console.error("Load publishers failed:", err);
      setError(getErrorMessage(err, "Không thể tải danh sách nhà xuất bản"));
      setPublishers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPublishers();
  }, [loadPublishers]);

  const resetForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingPublisher(null);
    setFormData(emptyForm);
    setFormError(null);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setSelectedPublisher(null);
    setEditingPublisher(null);
    setFormData(emptyForm);
    setFormError(null);
    setError(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((publisher: Publisher) => {
    setSelectedPublisher(null);
    setEditingPublisher(publisher);
    setFormData({
      publisherName: publisher.publisherName,
    });
    setFormError(null);
    setError(null);
    setIsFormOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const publisherName = formData.publisherName.trim();

      if (!publisherName) {
        setFormError("Vui lòng nhập tên nhà xuất bản");
        return;
      }

      setSaving(true);
      setFormError(null);
      setError(null);

      try {
        const payload = { publisherName };

        if (editingPublisher) {
          await publisherService.updatePublisher(
            editingPublisher.publisherId,
            payload,
          );
          showToast("Đã cập nhật nhà xuất bản thành công", "success");
        } else {
          await publisherService.createPublisher(payload);
          showToast("Đã thêm nhà xuất bản thành công", "success");
        }

        resetForm();
        await loadPublishers();
      } catch (err) {
        console.error("Save publisher failed:", err);
        setFormError(getErrorMessage(err, "Không thể lưu nhà xuất bản"));
      } finally {
        setSaving(false);
      }
    },
    [editingPublisher, formData.publisherName, loadPublishers, resetForm, showToast],
  );

  const handleDelete = useCallback(
    async (publisher: Publisher) => {
      const confirmed = window.confirm(
        `Bạn có chắc muốn xóa nhà xuất bản "${publisher.publisherName}"?`,
      );

      if (!confirmed) return;

      setError(null);

      try {
        await publisherService.deletePublisher(publisher.publisherId);
        showToast("Đã xóa nhà xuất bản thành công", "success");
        await loadPublishers();
      } catch (err) {
        console.error("Delete publisher failed:", err);
        setError(getErrorMessage(err, "Không thể xóa nhà xuất bản"));
      }
    },
    [loadPublishers, showToast],
  );

  return {
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
  };
};
