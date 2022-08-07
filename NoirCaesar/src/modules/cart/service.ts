import { api } from '@goldfishcode/noir-caesar-api-sdk';

export const getListCart = async () => {
  try {
    const response = await api.Shop.getCart();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const addToCart = async (product_url: string, quantity: number) => {
  try {
    const response = await api.Shop.addCart(product_url, quantity);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const updateQuantity = async (line_url: string, quantity: number) => {
  try {
    const response = await api.Shop.updateQuantity(line_url, quantity);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const removeCartItem = async (line_url: string) => {
  try {
    const response = await api.Shop.deleteProductInCart(line_url);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const deleteCart = async (basket_id: number) => {
  try {
    const response = await api.Shop.deleteCart(basket_id);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getListProducts = async (page?: number, limit?: number) => {
  try {
    const response = await api.Shop.getProducts(page, limit);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getProductDetail = async (product_id: number) => {
  try {
    const response = await api.Shop.getProductDetail(product_id);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
