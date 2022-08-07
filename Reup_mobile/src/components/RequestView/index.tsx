import React from 'react';
import { View, Image } from 'react-native';
import styles from './styles';
import RequestItem from './RequestItem';

import NewIcon from '@src/res/icons/new-request-icon/new-request-icon.png';
import PendingIcon from '@src/res/icons/pending-request-icon/pending-request-icon.png';
import InProgressIcon from '@src/res/icons/inprogress-request-icon/inprogress-request-icon.png';
import DoneIcon from '@src/res/icons/done-request-icon/done-request-icon.png';
import TypeRequest from './enum';
import { Theme } from '../Theme';
import translate from '@src/localize';
import { CustomText } from '../CustomText';
import { CustomButton } from '../CustomButton';
import { ICON_MAINTENANCE } from '@src/constants/icons';
import ICON_SEARCH from '@src/res/icons/icon-search-white.png';
import CustomSectionHeader from '../CustomSection';
import { CustomTouchable } from '../CustomTouchable';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import { IGeneralRequestStatus } from '@reup/reup-api-sdk/libs/api/maintenance/request/model';

interface Props {
  width?: number;
  height?: number;
  onPressItem: (typeRequest: TypeRequest) => void;
}

const RequestView = (props: Props) => {
  const countGeneral = useSelector<RootState, IGeneralRequestStatus>((state: RootState) => state.maintenance.general);
  const { onPressItem, } = props;
  const listColor = Theme.maintenanceRequest.listItemColor;
  return (
    <View style={[{ width: props.width, height: props.height }]}>
      <View style={styles.container}>
        <RequestItem
          widthPercent={'50%'}
          heightPercent={'50%'}
          icon={NewIcon}
          borderColor={'#3D90D9'}
          title={translate('maintenance.waiting')}
          typeRequest={TypeRequest.Waiting}
          numberRequest={countGeneral && countGeneral.waiting_count ? countGeneral.waiting_count : 0}
          onPressItem={onPressItem}
        />
        <RequestItem
          widthPercent={'50%'}
          heightPercent={'50%'}
          icon={PendingIcon}
          borderColor={'#FF5D15'}
          title={translate('maintenance.pending')}
          numberRequest={countGeneral && countGeneral.pending_count ? countGeneral.pending_count : 0}
          typeRequest={TypeRequest.Pending}
          onPressItem={onPressItem}
        />
        <RequestItem
          widthPercent={'50%'}
          heightPercent={'50%'}
          icon={InProgressIcon}
          borderColor={'#00AF08'}
          title={translate('maintenance.in_progress')}
          numberRequest={countGeneral && countGeneral.in_progress_count ? countGeneral.in_progress_count : 0}
          typeRequest={TypeRequest.In_Progress}
          onPressItem={onPressItem}
        />
        <RequestItem
          widthPercent={'50%'}
          heightPercent={'50%'}
          icon={DoneIcon}
          borderColor={'#AF9800'}
          title={translate('maintenance.done')}
          numberRequest={countGeneral && countGeneral.done_count ? countGeneral.done_count : 0}
          typeRequest={TypeRequest.Done}
          onPressItem={onPressItem}
        />
      </View>
    </View>
  );
};

export default RequestView;
