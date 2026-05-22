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

// GET /api/v1/authors
export const getAuthors = async (): Promise<Author[]> => {
  const res = await axiosClient.get("/authors");

  return res.data.result;
};

// GET /api/v1/authors/{id}
export const getAuthorById = async (id: string | number): Promise<Author> => {
  const res = await axiosClient.get(`/authors/${id}`);

  return res.data.result;
};

// POST /api/v1/authors
export const createAuthor = async (
  data: AuthorPayload,
): Promise<Author> => {
  const res = await axiosClient.post("/authors", data);

  return res.data.result;
};

// PATCH /api/v1/authors/{id}
export const updateAuthor = async (
  id: string | number,
  data: Partial<AuthorPayload>,
): Promise<Author> => {
  const res = await axiosClient.patch(`/authors/${id}`, data);

  return res.data.result;
};

// DELETE /api/v1/authors/{id}
export const deleteAuthor = async (id: string | number): Promise<void> => {
  await axiosClient.delete(`/authors/${id}`);
};

export const getTotalAuthors = async (): Promise<number> => {
  const authors = await getAuthors();

  return authors.length;
};
