import {isEmpty, shuffle} from 'lodash-es';
import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';

import {useGetForTransactionCursorLazyQuery} from '../../../../api/graphql/generated/graphql';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS, normal, small} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomButton from '../../../../components/Button/CustomButton';
import LazyList, {PAGING_TYPE} from '../../../../components/LazyList';
import {mapSellConsultantInfoToData} from '../../../../utils/DataProcessUtil';
import {Price} from '../../../BookingDeposit/ConfirmProperty/ConfirmPropertyComponents';
import {BookingContext} from '../../useBooking';
import SellAgentItem, {getFullSizeSellAgentItem} from './SellAgentItem';

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  nextBtn: {
    ...commonStyles.buttonNext,
    ...METRICS.marginBottom,
    flex: 1.5,
    marginLeft: normal,
  },
  skipBtn: {
    ...commonStyles.buttonNext,
    ...METRICS.marginBottom,
    paddingHorizontal: 20,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
  },
  divider: {height: 1, backgroundColor: COLORS.NEUTRAL_DIVIDER, marginBottom: normal},
  contentList: {marginTop: 100, ...METRICS.resetMargin},
});

const renderItem = (item, onPress, selectedItem) => {
  const isSelected = selectedItem ? item.itemId === selectedItem.itemId : false;
  return <SellAgentItem item={item} onPress={onPress} isSelected={isSelected} />;
};

const MainAgentListContent = ({
  keyword,
  staffGroupIds,
  dataSearch,
  selectedAgent: selectedItem,
  onPressConfirmAgent = () => {},
  onSelectedAgent = () => {},
  price,
}) => {
  const {state: moduleState, setAgent} = useContext(BookingContext);
  const queryParams = {
    first: 20,
    after: '',
    request: {
      propertyPostId: moduleState.propertyPost?.propertyPostId ?? '',
      keywords: keyword,
      staffGroupIds: isEmpty(staffGroupIds) ? null : staffGroupIds,
      ...(isEmpty(dataSearch?.places)
        ? null
        : {
            places: JSON.stringify(dataSearch.places),
          }),
    },
  };

  const onPressItem = item => {
    onSelectedAgent(item);
  };

  const onPressConfirm = type => {
    setAgent(selectedItem);
    onPressConfirmAgent(type);
  };

  const confirmButtonColor = {
    backgroundColor: selectedItem === null ? COLORS.DISABLE_BUTTON : COLORS.PRIMARY_A100,
  };

  return (
    <View style={styles.viewContainer}>
      <LazyList
        renderItem={({item}) => renderItem(item, onPressItem, selectedItem)}
        itemHeight={item => getFullSizeSellAgentItem(item?.node)}
        useQuery={useGetForTransactionCursorLazyQuery}
        queryOptions={{variables: queryParams}}
        responseDataKey={'getConsultantsForTransactionCursor'}
        pagingType={PAGING_TYPE.CURSOR2}
        mapToUiModel={item => mapSellConsultantInfoToData(item?.node)}
        uniqueKey={'staffId'}
        scrollEventThrottle={16}
        contentStyle={styles.contentList}
        extractTotalCount={response => {
          const totalCount = response?.getConsultantsForTransactionCursor?.totalCount ?? 0;
          return totalCount;
        }}
        extractArray={response => {
          const array: [] = response?.getConsultantsForTransactionCursor?.edges ?? [];
          if (array.length > 2) {
            const lastCursorItem = array[array.length - 1];
            return shuffle(array.slice(0, array.length - 1)).concat(lastCursorItem);
          }
          return array;
        }}
      />
      <View style={styles.divider} />
      <Price type={moduleState?.propertyPost.contextType} price={price} />
      <View
        style={{
          ...HELPERS.row,
          marginTop: small,
          marginHorizontal: normal,
        }}>
        <CustomButton
          style={styles.skipBtn}
          title={translate('project.filterConsultant.recommendSystem')}
          titleColor={COLORS.PRIMARY_A100}
          onPress={() => onPressConfirm('skip')}
          titleStyle={FONTS.bold}
        />
        <CustomButton
          style={[styles.nextBtn, confirmButtonColor]}
          title={translate('common.next')}
          onPress={() => onPressConfirm('next')}
          disabled={selectedItem === null}
        />
      </View>
    </View>
  );
};

export default MainAgentListContent;
