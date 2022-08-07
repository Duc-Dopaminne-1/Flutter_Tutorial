import {
  IActionGetListNotificationPayLoad,
  IActionGetListNotification,
  ActionTypes,
  IActionSaveNotificationsPayload,
  IActionSaveNotifications,
  IActionLoadMoreNotificationsPayload,
  IActionLoadMoreNotifications,
  IActionDenyNotification,
  IActionDenyNotificationPayload,
  IActionApproveNotificationPayload,
  IActionApproveNotification,
  IActionSaveListForSalePayload,
  IActionSaveListForSale,
  IActionLoadMoreListForSalePayload,
  IActionLoadMoreListForSale,
  IActionGetListForSalePayload,
  IActionGetListForSale,
  IActionLoadMoreListForLeasePayload,
  IActionLoadMoreListForLease,
  IActionSaveListForLeasePayload,
  IActionSaveListForLease,
  IActionGetListForLeasePayload,
  IActionGetListForLease,
  IActionCreatePostForLeasePayload,
  IActionCreatePostForLease,
  IActionCreatePostForSalePayload,
  IActionCreatePostForSale,
  IActionActiveForLeasePayload,
  IActionActiveForLease,
  IActionDeclineForLeasePayload,
  IActionDeclineForLease,
  IActionActiveForSale,
  IActionActiveForSalePayload,
  IActionDeclineForSalePayload,
  IActionDeclineForSale,
  IActionNewMonthlyBillPayload,
  IActionNewMonthlyBill,
  IActionGetListMonthlyBillPayload,
  IActionGetListMonthlyBill,
  IActionSaveMonthlyBillsPayload,
  IActionSaveMonthlyBills,
  IActionLoadMoreMonthlyBillsPayload,
  IActionLoadMoreMonthlyBills,
  IActionApproveMonthlyBillPayload,
  IActionApproveMonthlyBill,
  IActionDeleteMonthlyBillPayload,
  IActionDeleteMonthlyBill,
  IActionEditMonthlyBillPayload,
  IActionEditMonthlyBill,
  IActionCheckoutMonthlyBillPayload,
  IActionCheckoutMonthlyBill,
  IActionCreateNotificationPayload,
  IActionCreateNotification,
} from './index';

function getListNotification(payload: IActionGetListNotificationPayLoad): IActionGetListNotification {
  return {
    type: ActionTypes.GET_LIST_NOTIFICATION,
    payload,
  };
}

function saveNotifications(payload: IActionSaveNotificationsPayload): IActionSaveNotifications {
  return {
    type: ActionTypes.SAVE_NOTIFICATIONS,
    payload,
  };
}

function loadMoreNotifications(payload: IActionLoadMoreNotificationsPayload): IActionLoadMoreNotifications {
  return {
    type: ActionTypes.LOAD_MORE_NOTIFICATIONS,
    payload,
  };
}

function denyNotification(payload: IActionDenyNotificationPayload): IActionDenyNotification {
  return {
    type: ActionTypes.DENY_NOTIFICATION,
    payload,
  };
}

function createNotification(payload: IActionCreateNotificationPayload): IActionCreateNotification {
  return {
    type: ActionTypes.CREATE_NOTIFICATION,
    payload,
  };
}

function approveNotification(payload: IActionApproveNotificationPayload): IActionApproveNotification {
  return {
    type: ActionTypes.APPROVE_NOTIFICATION,
    payload,
  };
}

function createPostForSale(payload: IActionCreatePostForSalePayload): IActionCreatePostForSale {
  return {
    type: ActionTypes.CREATE_POST_FOR_SALE,
    payload,
  };
}

function createPostForLease(payload: IActionCreatePostForLeasePayload): IActionCreatePostForLease {
  return {
    type: ActionTypes.CREATE_POST_FOR_LEASE,
    payload,
  };
}

function getListForLease(payload: IActionGetListForLeasePayload): IActionGetListForLease {
  return {
    type: ActionTypes.GET_LIST_FOR_LEASE,
    payload,
  };
}

function saveListForLease(payload: IActionSaveListForLeasePayload): IActionSaveListForLease {
  return {
    type: ActionTypes.SAVE_LIST_FOR_LEASE,
    payload,
  };
}

function loadMoreListForLease(payload: IActionLoadMoreListForLeasePayload): IActionLoadMoreListForLease {
  return {
    type: ActionTypes.LOAD_MORE_FOR_LEASE,
    payload,
  };
}

function getListForSale(payload: IActionGetListForSalePayload): IActionGetListForSale {
  return {
    type: ActionTypes.GET_LIST_FOR_SALE,
    payload,
  };
}

function saveListForSale(payload: IActionSaveListForSalePayload): IActionSaveListForSale {
  return {
    type: ActionTypes.SAVE_LIST_FOR_SALE,
    payload,
  };
}

function loadMoreListForSale(payload: IActionLoadMoreListForSalePayload): IActionLoadMoreListForSale {
  return {
    type: ActionTypes.LOAD_MORE_FOR_SALE,
    payload,
  };
}

function activeForLease(payload: IActionActiveForLeasePayload): IActionActiveForLease {
  return {
    type: ActionTypes.ACTIVE_FOR_LEASE,
    payload,
  };
}

function declineForLease(payload: IActionDeclineForLeasePayload): IActionDeclineForLease {
  return {
    type: ActionTypes.DECLINE_FOR_LEASE,
    payload,
  };
}

function activeForSale(payload: IActionActiveForSalePayload): IActionActiveForSale {
  return {
    type: ActionTypes.ACTIVE_FOR_SALE,
    payload,
  };
}

function declineForSale(payload: IActionDeclineForSalePayload): IActionDeclineForSale {
  return {
    type: ActionTypes.DECLINE_FOR_SALE,
    payload,
  };
}

function newMonthlyBill(payload: IActionNewMonthlyBillPayload): IActionNewMonthlyBill {
  return {
    type: ActionTypes.NEW_MONTHLY_BILL,
    payload,
  };
}

function getListMonthlyBill(payload: IActionGetListMonthlyBillPayload): IActionGetListMonthlyBill {
  return {
    type: ActionTypes.GET_LIST_MONTHLY_BILL,
    payload,
  };
}

function saveMonthlyBills(payload: IActionSaveMonthlyBillsPayload): IActionSaveMonthlyBills {
  return {
    type: ActionTypes.SAVE_MONTHLY_BILLS,
    payload,
  };
}

function loadMoreMonthlyBills(payload: IActionLoadMoreMonthlyBillsPayload): IActionLoadMoreMonthlyBills {
  return {
    type: ActionTypes.LOAD_MORE_MONTHLY_BILLS,
    payload,
  };
}

function approveMonthlyBill(payload: IActionApproveMonthlyBillPayload): IActionApproveMonthlyBill {
  return {
    type: ActionTypes.APPROVE_MONTHLY_BILL,
    payload,
  };
}

function deleteMonthlyBill(payload: IActionDeleteMonthlyBillPayload): IActionDeleteMonthlyBill {
  return {
    type: ActionTypes.DELETE_MONTHLY_BILL,
    payload,
  };
}

function editMonthlyBill(payload: IActionEditMonthlyBillPayload): IActionEditMonthlyBill {
  return {
    type: ActionTypes.EDIT_MONTHLY_BILL,
    payload,
  };
}

function checkoutMonthlyBill(payload: IActionCheckoutMonthlyBillPayload): IActionCheckoutMonthlyBill {
  return {
    type: ActionTypes.CHECKOUT_MONTHLY_BILL,
    payload,
  };
}

export {
  getListNotification,
  saveNotifications,
  loadMoreNotifications,
  denyNotification,
  approveNotification,
  createPostForLease,
  createPostForSale,
  getListForLease,
  saveListForLease,
  loadMoreListForLease,
  getListForSale,
  saveListForSale,
  loadMoreListForSale,
  activeForLease,
  declineForLease,
  activeForSale,
  declineForSale,
  newMonthlyBill,
  loadMoreMonthlyBills,
  saveMonthlyBills,
  getListMonthlyBill,
  editMonthlyBill,
  deleteMonthlyBill,
  approveMonthlyBill,
  checkoutMonthlyBill,
  createNotification,
};
