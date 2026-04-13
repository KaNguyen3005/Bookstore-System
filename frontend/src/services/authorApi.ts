import { authorsMock, type Author } from "../data/author";
export type { Author };


let authorsDB: Author[] = [...authorsMock];


export const getAuthors = async (): Promise<Author[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...authorsDB]);
    }, 300);
  });
};


export const getTotalAuthors = async (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(authorsDB.length);
    }, 200);
  });
};

export const getAuthorById = async (id: number): Promise<Author | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(authorsDB.find((a) => a.author_id === id));
    }, 200);
  });
};


export const createAuthor = async (
  data: Omit<Author, "author_id">
): Promise<Author> => {
  return new Promise((resolve) => {
    const newAuthor: Author = {
      ...data,
      author_id: authorsDB.length + 1,
    };

    authorsDB.push(newAuthor);

    setTimeout(() => resolve(newAuthor), 300);
  });
};


export const deleteAuthor = async (id: number): Promise<void> => {
  authorsDB = authorsDB.filter((a) => a.author_id !== id);

  return new Promise((resolve) => {
    setTimeout(() => resolve(), 200);
  });
};