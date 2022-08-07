import React, {createRef, useState} from 'react';
import {Keyboard, View} from 'react-native';

import {BUY_REQUEST_TYPE, ContactType} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {HELPERS} from '../../../assets/theme/helpers';
import BaseScreen from '../../../components/BaseScreen';
import FilterButton from '../../../components/Button/FilterButton';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import {useMount} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';
import BuyRequestUtil from '../BuyRequestUtil';
import useGetAgentInfo from '../hooks/useGetAgentInfo';
import ManageBuyRequestB2CScreen from './ManageBuyRequestB2CScreen';
import ManageBuyRequestC2CScreen from './ManageBuyRequestC2CScreen';
import BuyRequestFilter from './ManageBuyRequestComponents/BuyRequestFilter';
import BuyRequestFilterB2C from './ManageBuyRequestComponents/BuyRequestFilterB2C';

const ManageBuyRequestScreen = ({route}) => {
  const {typeSelect = 0} = route?.params;
  const isB2C = typeSelect === ContactType.B2C;
  const [onTabActive, setTabActive] = useState(0);
  const [filterDataB2C, setFilterDataB2C] = useState(() => BuyRequestUtil.getInitialFilterUIB2C());
  const [filterReceivedData, setFilterReceivedData] = useState(() =>
    BuyRequestUtil.getInitialFilterData(BUY_REQUEST_TYPE.RECEIVED),
  );
  const [filterSentData, setFilterSentData] = useState(() =>
    BuyRequestUtil.getInitialFilterData(BUY_REQUEST_TYPE.SENT),
  );
  const tabIsOnSentRequests = onTabActive === 0;

  const modalRef = createRef();

  const hideFilter = () => {
    modalRef.current?.close();
  };
  const showFilter = () => {
    Keyboard?.dismiss();
    modalRef.current?.open();
  };

  const onKeywordChange = searchKey => {
    const formatKey = String(searchKey).trim().toUpperCase();
    if (tabIsOnSentRequests) {
      setFilterSentData({...filterSentData, keywords: formatKey});
    } else {
      setFilterReceivedData({...filterReceivedData, keywords: formatKey});
    }
  };

  const onApplyFilter = data => {
    if (tabIsOnSentRequests) {
      setFilterSentData(data);
    } else {
      setFilterReceivedData(data);
    }
    hideFilter();
  };

  const onApplyFilterB2C = data => {
    setFilterDataB2C(data);
    hideFilter();
  };

  const onChangeTab = e => {
    setTabActive(e);
  };

  const [startGetUserInfoById] = useGetAgentInfo(); // get user role info for contactTradingProvider
  useMount(startGetUserInfoById);

  return (
    <BaseScreen
      title={translate(isB2C ? STRINGS.BUY_REQUEST_LIST : 'common.ContactToBuyProperty')}
      containerStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}
      testID={ScreenIds.ManageBuyRequest}
      rightComponent={
        isB2C ? <FilterButton title={translate(STRINGS.FILTER)} onPress={showFilter} /> : null
      }
      modals={[
        <ModalWithModalize key={1} getModalRef={modalRef}>
          {isB2C ? (
            <BuyRequestFilterB2C
              type={tabIsOnSentRequests ? BUY_REQUEST_TYPE.SENT : BUY_REQUEST_TYPE.RECEIVED}
              filterData={filterDataB2C}
              onClose={hideFilter}
              onConfirmed={onApplyFilterB2C}
            />
          ) : (
            <BuyRequestFilter
              type={tabIsOnSentRequests ? BUY_REQUEST_TYPE.SENT : BUY_REQUEST_TYPE.RECEIVED}
              filterData={tabIsOnSentRequests ? filterSentData : filterReceivedData}
              onClose={hideFilter}
              onConfirmed={onApplyFilter}
            />
          )}
        </ModalWithModalize>,
      ]}>
      <View style={HELPERS.fill}>
        {isB2C ? (
          <ManageBuyRequestB2CScreen filterData={filterDataB2C} />
        ) : (
          <ManageBuyRequestC2CScreen
            filterSentData={filterSentData}
            filterReceivedData={filterReceivedData}
            onChangeTab={onChangeTab}
            showFilter={showFilter}
            onKeywordChange={onKeywordChange}
          />
        )}
      </View>
    </BaseScreen>
  );
};

export default ManageBuyRequestScreen;
