import axiosClient from "./axiosClient";
import type { Author } from "../data/author";

// GET all
export const getAuthors = async (): Promise<Author[]> => {
  const res = await axiosClient.get("/authors");
  return res.data.result;
};

// GET by id
export const getAuthorById = async (id: number): Promise<Author> => {
  const res = await axiosClient.get(`/authors/${id}`);
  return res.data.result;
};

// CREATE
export const createAuthor = async (
  data: Omit<Author, "author_id">,
): Promise<Author> => {
  const res = await axiosClient.post("/authors", data);
  return res.data.result;
};

// DELETE
export const deleteAuthor = async (id: number): Promise<void> => {
  await axiosClient.delete(`/authors/${id}`);
};

// PATCH / UPDATE
export const updateAuthor = async (
  id: number,
  data: Partial<Author>,
): Promise<Author> => {
  const res = await axiosClient.patch(`/authors/${id}`, data);
  return res.data.result;
};

export const getTotalAuthors = async (): Promise<number> => {
  const res = await axiosClient.get("/authors");
  return res.data.result.length;
};