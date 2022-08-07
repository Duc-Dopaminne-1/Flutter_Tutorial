import { ApiClient } from '@/services/http/client';
import {
  ActionCreateCardPayload,
  ActionGetStatusPaymentPayload,
  ActionGetTransactionsInfoPayload,
  ActionSetPaymentDefaultPayload,
  ActionUpdateCardPayload,
  ActionUpdatePaypalPayload,
} from '@/redux/payment';

export class Payment {
  static async getStatusPayment(param: ActionGetStatusPaymentPayload): Promise<any> {
    const { transactionId } = param;
    return ApiClient.post(`/transactions/${transactionId}/capture`, {});
  }

  static async getAllPayment(): Promise<any> {
    return ApiClient.get('/payments');
  }

  static async createCard(param: ActionCreateCardPayload): Promise<any> {
    return ApiClient.post('/payments', param);
  }

  static async setPaymentDefault(param: ActionSetPaymentDefaultPayload): Promise<any> {
    const url = `/payments/${param.id}/default`;
    return ApiClient.post(url);
  }

  static async setReceivedDefault(param: ActionSetPaymentDefaultPayload): Promise<any> {
    const url = `/payments/${param.id}/default-payout`;
    return ApiClient.post(url);
  }

  static async deleteCard(param: ActionSetPaymentDefaultPayload): Promise<any> {
    const url = `/payments/${param.id}`;
    return ApiClient.delete(url);
  }

  static async updateCard(param: ActionUpdateCardPayload): Promise<any> {
    const url = `/payments/${param.id}`;
    const params = {
      cardholderName: param.cardholderName,
      expirationMonth: param.expirationMonth,
      expirationYear: param.expirationYear,
    };
    return ApiClient.put(url, params);
  }

  static async updatePaypal(param: ActionUpdatePaypalPayload): Promise<any> {
    const url = `/payments/${param.id}`;
    const params = {
      email: param.email,
    };
    return ApiClient.put(url, params);
  }

  static async getClientSecret(): Promise<any> {
    return ApiClient.get('/payments/stripe/setup-intents');
  }

  // Get list penalty fee
  static async getTransactionsRequired(): Promise<any> {
    return ApiClient.get('/transactions/required');
  }

  // Get link Paypal
  static async getTransactionsInfo(param: ActionGetTransactionsInfoPayload): Promise<any> {
    const url = param.isFromAuctionDetail ? `/auctions/${param.id}/pay` : `/transactions/${param.id}/retry`;
    return ApiClient.post(url);
  }
}
