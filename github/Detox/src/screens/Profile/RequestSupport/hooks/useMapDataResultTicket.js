import {useEffect, useState} from 'react';

const initState = {
  supportServiceTicketId: '',
  resultDescriptions: {
    isCorrectAddressOfPropertyPost: true,
    isCorrectDescriptionPropertyPost: true,
  },
  note: '',
  resultDocuments: {
    descriptionImproveContent: '',
    isCorrectDocumentOfPropertyPost: true,
    titleImproveContent: '',
    files: [],
  },
  resultImages: {
    bedRoomImages: [],
    entranceImages: [],
    frontHouseImages: [],
    kitchenImages: [],
    livingRoomImages: [],
    note: '',
  },
};

const useMapDataResultTicket = ({containerState}) => {
  const [state, setState] = useState(initState);

  useEffect(() => {
    setState({
      autoAcceptTicketInMinutes: containerState?.autoAcceptTicketInMinutes,
      resultDescriptions: {
        isCorrectAddressOfPropertyPost:
          containerState?.resultDescriptions?.isCorrectAddressOfPropertyPost,
        isCorrectDescriptionPropertyPost:
          containerState?.resultDescriptions?.isCorrectDescriptionPropertyPost,
      },
      resultDocuments: {
        files: containerState?.resultDocuments?.files,
        isCorrectDocumentOfPropertyPost:
          containerState?.resultDocuments?.isCorrectDocumentOfPropertyPost,
        titleImproveContent: containerState?.resultDocuments?.titleImproveContent,
        descriptionImproveContent: containerState?.resultDocuments?.descriptionImproveContent,
      },
      resultImages: {
        bedRoomImages: containerState?.resultImages?.bedRoomImages,
        entranceImages: containerState?.resultImages?.entranceImages,
        frontHouseImages: containerState?.resultImages?.frontHouseImages,
        kitchenImages: containerState?.resultImages?.kitchenImages,
        livingRoomImages: containerState?.resultImages?.livingRoomImages,
        note: containerState?.resultImages?.note,
      },
    });
  }, [containerState]);

  return {
    state,
  };
};

export default useMapDataResultTicket;
