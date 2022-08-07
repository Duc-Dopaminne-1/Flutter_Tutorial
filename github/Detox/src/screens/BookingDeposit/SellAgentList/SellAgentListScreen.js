import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext, useRef, useState} from 'react';
import {Keyboard, StyleSheet} from 'react-native';

import {NAVIGATION_ANIMATION_DURATION} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import BaseScreen from '../../../components/BaseScreen';
import ScreenIds from '../../ScreenIds';
import SearchHeader from '../../Search/components/SearchHeader';
import {TrackingActions} from '../../WithSegment';
import {BookingContext} from '../useBooking';
import MainAgentListContent from './components/MainAgentListContent';
import {ModalFilterConsultant} from './ModalFilterConsultant';

const SellAgentListScreen = ({navigation, route}) => {
  const {price, staffGroupIds} = route?.params;
  const {track} = useAnalytics();
  const {
    resetCustomerDepositInfo,
    setConsultantInfo,
    state: moduleState,
  } = useContext(BookingContext);
  const [dataSearch, setDataSearch] = useState();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const modalFilter = useRef(null);
  const [keyword, setKeyword] = useState('');

  const applyFilterConsultant = dataFilter => {
    setDataSearch(dataFilter);
  };

  const onPressButton = type => {
    let consultantInfo = false;
    if (type === 'next') {
      consultantInfo = selectedAgent;
    }

    track(TrackingActions.projectOrderAgentSelected, {
      project_name: moduleState?.project?.projectName,
      project_status: moduleState?.project?.projectStatusDescription,
      agent_name: selectedAgent?.fullName,
    });

    setTimeout(() => {
      resetCustomerDepositInfo();
      setConsultantInfo(consultantInfo);
      navigation.navigate(ScreenIds.ConfirmTransaction, {consultantInfo: consultantInfo});
    }, NAVIGATION_ANIMATION_DURATION);
  };

  const onPressFilter = () => {
    Keyboard.dismiss();
    modalFilter.current.open();
  };

  return (
    <BaseScreen
      showHeaderShadow
      containerStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}
      title={translate('project.filterConsultant.selectConsultant')}>
      <SearchHeader
        placeholder={translate('project.filterConsultant.placeHolder')}
        renderLeft={false}
        value={keyword}
        onChangeKeyword={setKeyword}
        onFilterPress={onPressFilter}
        customStyle={styles.inputSearch}
      />
      <MainAgentListContent
        price={price}
        staffGroupIds={staffGroupIds}
        keyword={keyword}
        dataSearch={dataSearch}
        onPressConfirmAgent={onPressButton}
        selectedAgent={selectedAgent}
        onSelectedAgent={setSelectedAgent}
        applyFilterConsultant={applyFilterConsultant}
      />
      <ModalFilterConsultant
        hideFilterGroups={true}
        applyFilterConsultant={applyFilterConsultant}
        ref={modalFilter}
      />
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  inputSearch: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.SELECTED_AREA,
    marginLeft: 16,
  },
});

export default SellAgentListScreen;
