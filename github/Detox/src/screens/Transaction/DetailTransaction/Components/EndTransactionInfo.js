import React from 'react';

import {SectionComponent} from './DetailTransactionComponents';

const EndTransactionInfo = ({time, titleFinishStep}) => {
  return <SectionComponent title={titleFinishStep} subTitle={time} />;
};

export default EndTransactionInfo;
