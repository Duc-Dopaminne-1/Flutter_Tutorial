import {ImageSource} from '../../../hooks/usePhotoViewer';

export type RequestResultState = {
  validationCriteria: {
    isCorrectAddressOfPropertyPost: Boolean,
    isCorrectDescriptionPropertyPost: Boolean,
  },
  documents: Array<ImageSource>,
  entranceImages: Array<ImageSource>,
  frontHouseImages: Array<ImageSource>,
  livingRoomImages: Array<ImageSource>,
  bedroomImages: Array<ImageSource>,
  kitchenImages: Array<ImageSource>,
  contentSuggestion: {
    title: String,
    description: String,
  },
  resultStatus: String,
  resultNote: String,
};

export type RejectTicketResultModalContainerProps = {
  ticketId: String,
};

export type GetPaymentInfoInput = {
  ticketId: String,
  propertyPostId: String,
  userId: String,
  executorId: String,
  amount: Number,
  supportTypeId: String,
  paymentMethod: String,
  executorId: String,
  ticketId: String,
  userId: String,
  supportTypeId: String,
  propertyPostId: String,
  paymentCode: String,
  requestNoted: String,
};

export type RefundInfo = {
  supportServiceName: String,
  supportServicePrice: String,
  paymentMethod: String,
  refundAmount: String,
};
