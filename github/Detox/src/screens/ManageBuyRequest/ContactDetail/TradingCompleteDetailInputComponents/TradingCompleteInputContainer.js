import React from 'react';
import {ScrollView} from 'react-native';

import CompleteDetailInputView from './Components/CompleteDetailInputView';

const TradingCompleteInputContainer = ({state, photoViewer}) => {
  const {propertyPostInfo: {propertyCode = '', price = ''} = {}, contract} =
    state.contactTradingInfo ?? {};

  return (
    <ScrollView>
      <CompleteDetailInputView
        photoViewer={photoViewer}
        contractPrice={contract?.contractPrice}
        comission={contract?.totalComission}
        consultantComission={contract?.consultantComissionAmount}
        sellerComission={contract?.salerComissionAmount}
        propertyPrice={price}
        signedDate={contract?.signedDate}
        organizerComission={contract?.organizerComissionAmount}
        buyerComission={contract?.buyerComissionAmount}
        totalComission={((contract?.totalComission ?? 0) * contract.contractPrice) / 100}
        propertyCode={propertyCode}
        contractNote={contract?.contractNote}
        attachment={contract?.attachment ?? []}
        comissionUnit={contract?.totalComissionUnit}
      />
    </ScrollView>
  );
};

export default TradingCompleteInputContainer;
