import {
  ActionTypes,
  IActionGetListShoppingProductPayload,
  IActionGetListShoppingProduct,
  IActionGetListProductCategoryPayload,
  IActionGetListProductCategory,
  IActionSaveListProductCategoryPayload,
  IActionSaveListProductCategory,
  IActionLoadMoreListProductCategory,
  IActionCreateProductCategoryPayload,
  IActionCreateProductCategory,
  IActionUpdateProductCategoryPayload,
  IActionUpdateProductCategory,
  IActionDeleteProductCategoryPayload,
  IActionDeleteProductCategory,
  IActionSaveListShoppingProduct,
  IActionSaveListShoppingProductPayload,
  IActionLoadMoreShoppingProductPayload,
  IActionLoadMoreShoppingProduct,
  IActionChangeStatusShoppingProductPayload,
  IActionChangeStatusShoppingProduct,
  IActionUpdateShoppingProduct,
  IActionUpdateShoppingProductPayload,
  IActionSaveListRelativeProductPayload,
  IActionSaveListRelativeProduct,
  IActionLoadMoreRelativeProductPayload,
  IActionLoadMoreRelativeProduct,
  IActionCreateResidentShoppingProductPayload,
  IActionCreateResidentShoppingProduct,
  IActionGetListResidentProductCategoryPayload,
  IActionGetListResidentProductCategory,
  IActionGetMyShopProductListPayload,
  IActionGetMyShopProductList,
  IActionSaveMyShopProductListPayload,
  IActionLoadMoreMyShopProductListPayload,
  IActionLoadMoreMyShopProductList,
  IActionSaveMyShopProductList,
  IActionRemoveMyShopProductPayload,
  IActionRemoveMyShopProduct,
} from './index';

function getListShoppingProduct(payload: IActionGetListShoppingProductPayload): IActionGetListShoppingProduct {
  return {
    type: ActionTypes.GET_LIST_SHOPPING_PRODUCT,
    payload,
  };
}

function getListProductCategory(payload: IActionGetListProductCategoryPayload): IActionGetListProductCategory {
  return {
    type: ActionTypes.GET_LIST_PRODUCT_CATEGORY,
    payload
  };
}

function saveListShoppingProduct(payload: IActionSaveListShoppingProductPayload): IActionSaveListShoppingProduct {
  return {
    type: ActionTypes.SAVE_LIST_SHOPPING_PRODUCT,
    payload,
  };
}

function saveListProductCategory(payload: IActionSaveListProductCategoryPayload): IActionSaveListProductCategory {
  return {
    type: ActionTypes.SAVE_LIST_PRODUCT_CATEGORY,
    payload,
  };
}

function loadmoreListProductCategory(payload: IActionSaveListProductCategoryPayload): IActionLoadMoreListProductCategory {
  return {
    type: ActionTypes.LOAD_MORE_PRODUCT_CATEGORY,
    payload,
  };
}

function createProductCategory(payload: IActionCreateProductCategoryPayload): IActionCreateProductCategory {
  return {
    type: ActionTypes.CREATE_PRODUCT_CATEGORY,
    payload,
  };
}

function updateProductCategory(payload: IActionUpdateProductCategoryPayload): IActionUpdateProductCategory {
  return {
    type: ActionTypes.UPDATE_PRODUCT_CATEGORY,
    payload,
  };
}

function deleteProductCategory(payload: IActionDeleteProductCategoryPayload): IActionDeleteProductCategory {
  return {
    type: ActionTypes.DELETE_PRODUCT_CATEGORY,
    payload
  };
}

function loadMoreShoppingProduct(payload: IActionLoadMoreShoppingProductPayload): IActionLoadMoreShoppingProduct {
  return {
    type: ActionTypes.LOAD_MORE_SHOPPING_PRODUCT,
    payload,
  };
}

function changeStatusShoppingProduct(payload: IActionChangeStatusShoppingProductPayload): IActionChangeStatusShoppingProduct {
  return {
    type: ActionTypes.CHANGE_STATUS_SHOPPING_PRODUCT,
    payload,
  };
}

function updateShoppingProduct(payload: IActionUpdateShoppingProductPayload): IActionUpdateShoppingProduct {
  return {
    type: ActionTypes.UPDATE_SHOPPING_PRODUCT,
    payload,
  };
}

function saveListRelativeProduct(payload: IActionSaveListRelativeProductPayload): IActionSaveListRelativeProduct {
  return {
    type: ActionTypes.SAVE_LIST_RELATIVE_PRODUCT,
    payload,
  };
}


function loadMoreRelativeProduct(payload: IActionLoadMoreRelativeProductPayload): IActionLoadMoreRelativeProduct {
  return {
    type: ActionTypes.LOAD_MORE_RELATIVE_PRODUCT,
    payload,
  };
}

function createResidentShoppingProduct(payload: IActionCreateResidentShoppingProductPayload): IActionCreateResidentShoppingProduct {
  return {
    type: ActionTypes.CREATE_RESIDENT_SHOPPING_PRODUCT,
    payload
  };
}

function getListResidentProductCategory(payload: IActionGetListResidentProductCategoryPayload): IActionGetListResidentProductCategory {
  return {
    type: ActionTypes.GET_LIST_RESIDENT_PRODUCT_CATEGORY,
    payload
  };
}

function getMyShopProductList(payload: IActionGetMyShopProductListPayload): IActionGetMyShopProductList {
  return {
    type: ActionTypes.GET_LIST_MY_PRODUCT,
    payload,
  };
}

function saveMyShopProductList(payload: IActionSaveMyShopProductListPayload): IActionSaveMyShopProductList {
  return {
    type: ActionTypes.SAVE_LIST_MY_PRODUCT,
    payload,
  };
}

function loadmoreMyShopProductList(payload: IActionLoadMoreMyShopProductListPayload): IActionLoadMoreMyShopProductList {
  return {
    type: ActionTypes.LOAD_MORE_LIST_MY_PRODUCT,
    payload,
  };
}

function removeMyShopProduct(payload: IActionRemoveMyShopProductPayload): IActionRemoveMyShopProduct {
  return {
    type: ActionTypes.REMOVE_MY_SHOP_PRODUCT,
    payload,
  };
}

export {
  getListShoppingProduct,
  getListProductCategory,
  saveListProductCategory,
  loadmoreListProductCategory,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  saveListShoppingProduct,
  loadMoreShoppingProduct,
  changeStatusShoppingProduct,
  updateShoppingProduct,
  saveListRelativeProduct,
  loadMoreRelativeProduct,
  createResidentShoppingProduct,
  getListResidentProductCategory,
  getMyShopProductList,
  saveMyShopProductList,
  loadmoreMyShopProductList,
  removeMyShopProduct,
};
