import React from 'react';

import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import CrawlerFilterView from './CrawlerFilterView';
import CrawlerRejectView from './CrawlerRejectView';

export const CrawlerModalType = {
  FILTER: 'FILTER',
  REJECT: 'REJECT',
};

const CrawlerModalsContainer = ({modalType, state, modalRef, onConfirmed, onPressCancel}) => {
  return (
    <ModalWithModalize getModalRef={modalRef} modalTopOffset={16}>
      {modalType === CrawlerModalType.FILTER ? (
        <CrawlerFilterView
          data={{
            propertyTypes: state.propertyTypes,
            acreageRangeData: state.acreageRangeData,
            priceRangeData: state.priceRangeData,
            filterData: state.filterData,
          }}
          onConfirmed={onConfirmed}
        />
      ) : (
        <CrawlerRejectView
          data={state}
          onPressCancel={onPressCancel}
          onPressConfirm={onConfirmed}
        />
      )}
    </ModalWithModalize>
  );
};

export default CrawlerModalsContainer;
