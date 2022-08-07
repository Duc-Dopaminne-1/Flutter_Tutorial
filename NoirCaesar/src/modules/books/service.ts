import { api } from '@goldfishcode/noir-caesar-api-sdk';
import { BookListModeEnum, CreateBookData } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book';

export const getList = async (mode: BookListModeEnum, genres_id?: string, page?: number, limit?: number) => {
  try {
    const response = await api.Book.list(mode, page ? page : 1, limit ? limit : 10, genres_id ? genres_id : undefined);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getBook = async (book_id: string, is_collection?: boolean) => {
  try {
    const response = await api.Book.getBook(book_id, is_collection);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getlistChapter = async (book_id: string, page?: number, limit?: number, is_collection?: boolean) => {
  try {
    const response = await api.Book.listChapter(book_id, page ? page : 1, limit ? limit : 10, is_collection);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getGenres = async () => {
  try {
    const response = await api.Book.listGenres();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const createBook = async (data: CreateBookData) => {
  try {
    const response = await api.Book.createBook(data);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getChapter = async (chapterId: string, is_collection?: boolean) => {
  try {
    const response = await api.Book.getChapter(chapterId, is_collection);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const purchaseChapter = async (chapterId: string) => {
  try {
    const response = await api.Book.purchaseChapter(chapterId);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
