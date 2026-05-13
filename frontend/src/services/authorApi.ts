import axiosClient from "./axiosClient";

export type Author = {
  authorId: string;
  authorName: string;
  alias: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type AuthorPayload = {
  authorName: string;
  alias: string;
};

const unwrap = (data: any) => data?.result ?? data?.data ?? data;

const normalizeAuthor = (author: any): Author => ({
  ...author,
  authorId: String(author.authorId ?? author.author_id ?? author.id ?? ""),
  authorName:
    author.authorName ??
    author.author_name ??
    author.name ??
    "",
  alias: author.alias ?? author.penName ?? author.nickname ?? "",
  createdAt: author.createdAt ?? author.created_at,
  updatedAt: author.updatedAt ?? author.updated_at,
  deletedAt: author.deletedAt ?? author.deleted_at,
});

const normalizeAuthorsResponse = (data: any): Author[] => {
  const source = unwrap(data);
  const content = Array.isArray(source)
    ? source
    : source?.content ?? source?.data ?? [];

  return Array.isArray(content) ? content.map(normalizeAuthor) : [];
};

// GET /api/v1/authors
export const getAuthors = async (): Promise<Author[]> => {
  const res = await axiosClient.get("/authors");

  return normalizeAuthorsResponse(res.data);
};

// GET /api/v1/authors/{id}
export const getAuthorById = async (id: string | number): Promise<Author> => {
  const res = await axiosClient.get(`/authors/${id}`);

  return normalizeAuthor(unwrap(res.data));
};

// POST /api/v1/authors
export const createAuthor = async (
  data: AuthorPayload,
): Promise<Author> => {
  const res = await axiosClient.post("/authors", data);

  return normalizeAuthor(unwrap(res.data));
};

// PATCH /api/v1/authors/{id}
export const updateAuthor = async (
  id: string | number,
  data: Partial<AuthorPayload>,
): Promise<Author> => {
  const res = await axiosClient.patch(`/authors/${id}`, data);

  return normalizeAuthor(unwrap(res.data));
};

// DELETE /api/v1/authors/{id}
export const deleteAuthor = async (id: string | number): Promise<void> => {
  await axiosClient.delete(`/authors/${id}`);
};

export const getTotalAuthors = async (): Promise<number> => {
  const authors = await getAuthors();

  return authors.length;
};
