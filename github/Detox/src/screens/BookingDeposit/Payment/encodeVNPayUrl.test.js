import {encodeVNPayUrl} from './encodeVNPayUrl';

it('should parse success', () => {
  const url =
    'http://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2000000&vnp_Command=pay&vnp_CreateDate=20220514050518&vnp_CurrCode=VND&vnp_IpAddr=8.8.8.8&vnp_Locale=vi&vnp_OrderInfo=Deposit-Nguyen+Trong+Binh-TKT+Can+ho+-A021&vnp_ReturnUrl=https%3A%2F%2Fuat-citus.topenland.com%2Fpayment%2Fbooking_deposite%2Fvnpay_return&vnp_TmnCode=17HPBW0I&vnp_TxnRef=b9a96768-0dd7-49d7-b0f0-39eec4572c5a|2df7fd5c-2d7c-459f-9ec3-e89c110f7efc&vnp_Version=2.0.0&vnp_SecureHash=27ca6a0b6fd6c48d6f4921600fb951663b419785fd929c29117cefb1a0086c3a';
  const url2 =
    'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2000000&vnp_Command=pay&vnp_CreateDate=20220514050518&vnp_CurrCode=VND&vnp_IpAddr=8.8.8.8&vnp_Locale=vi&vnp_OrderInfo=Deposit-Nguyen%20Trong%20Binh-TKT%20Can%20ho%20-A021&vnp_ReturnUrl=https://uat-citus.topenland.com/payment/booking_deposite/vnpay_return&vnp_TmnCode=17HPBW0I&vnp_TxnRef=b9a96768-0dd7-49d7-b0f0-39eec4572c5a%7C2df7fd5c-2d7c-459f-9ec3-e89c110f7efc&vnp_Version=2.0.0&vnp_SecureHash=27ca6a0b6fd6c48d6f4921600fb951663b419785fd929c29117cefb1a0086c3a';
  const result = encodeVNPayUrl(url);

  expect(result).toBe(url2);
});
