import React, {useContext, useRef, useState} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';

import {useGetUserC2CDemandsLazyQuery} from '../../api/graphql/generated/graphql';
import {AppContext} from '../../appData/appContext/appContext';
import {EMPTY_TYPE} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {FONT_BOLD} from '../../assets/fonts';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {normal} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import BaseScreen from '../../components/BaseScreen';
import CustomButton from '../../components/Button/CustomButton';
import LazyList, {PAGING_TYPE} from '../../components/LazyList';
import ModalWithModalize from '../../components/Modal/ModalWithModalize';
import {getFullSizeImageDimension} from '../../utils/ImageUtil';
import MeasureUtils from '../../utils/MeasureUtils';
import ScreenIds from '../ScreenIds';
import SearchHeader from '../Search/components/SearchHeader';
import C2CGeneralRequestFilter, {getInitialFilterState} from './components/C2CGeneralRequestFilter';
import ListItem from './components/ListItem';
import {buildQueryFilter, mapGeneralRequestItem} from './utils/generalRequestUtils';

const fontSizeTitle = SIZES.FONT_18;
const fullSize = getFullSizeImageDimension();

export const ITEM_HEIGHT = async item => {
  const titleSize = await MeasureUtils.measureTextSize({
    fontSize: fontSizeTitle,
    fontFamily: FONT_BOLD,
    text: item?.title,
    width: fullSize.width - 16,
    lineInfoForLine: 2,
  });
  return 182 + titleSize.height;
};

const ManageGeneralRequestScreen = ({navigation}) => {
  const filterModalRef = useRef();
  const [filterState, setFilterState] = useState(getInitialFilterState());
  const [keyword, setKeyword] = useState('');
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();

  const onPressDetail = item => () => {
    navigation.navigate(ScreenIds.DetailGeneralRequestScreen, {
      demand: item,
    });
  };

  const onPressOpenFilter = () => {
    Keyboard.dismiss();
    filterModalRef?.current?.open();
  };

  const onPressApplyFilter = searchCriteria => {
    filterModalRef?.current?.close();
    setFilterState({
      ...filterState,
      ...searchCriteria,
      forSale: searchCriteria?.forSale,
    });
  };

  const renderModals = () => {
    return (
      <ModalWithModalize getModalRef={filterModalRef}>
        <C2CGeneralRequestFilter
          searchCriteria={filterState}
          setState={setFilterState}
          onPressApply={onPressApplyFilter}
          masterData={masterData}
        />
      </ModalWithModalize>
    );
  };

  const renderItem = ({item}) => {
    return <ListItem item={item} onPress={onPressDetail(item)} />;
  };

  const onCreateNewRequest = () => {
    navigation.navigate(ScreenIds.CreateGeneralRequestScreen);
  };

  const variables = buildQueryFilter(filterState, keyword);

  return (
    <BaseScreen
      showHeaderShadow
      testID={ScreenIds.ManageContactAdvice}
      containerStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}
      title={translate('common.c2CGeneralRequest')}
      modals={renderModals()}>
      <SearchHeader
        customStyle={styles.customSearch}
        style={styles.searchHeader}
        renderLeft={false}
        placeholder={translate('c2CGeneralRequest.searchPlaceholder')}
        onChangeKeyword={setKeyword}
        onFilterPress={onPressOpenFilter}
      />
      <LazyList
        useQuery={useGetUserC2CDemandsLazyQuery}
        queryOptions={{variables}}
        extractArray={response => response?.getUserC2CDemands?.edges ?? []}
        mapToUiModel={item => mapGeneralRequestItem(item)}
        renderItem={renderItem}
        itemHeight={ITEM_HEIGHT}
        pagingType={PAGING_TYPE.OFFSET_VARIABLES}
        emptyType={EMPTY_TYPE.BUY_REQUEST}
      />
      <View style={[commonStyles.footerContainer, styles.footer]}>
        <CustomButton
          style={styles.footerButton}
          titleStyle={styles.btnTitleStyle}
          title={translate(STRINGS.CREATE_REQUEST)}
          onPress={onCreateNewRequest}
        />
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  searchHeader: {marginLeft: normal, zIndex: 999},
  customSearch: {borderWidth: 1, borderColor: COLORS.GRAY_C9},
  footerButton: {
    ...commonStyles.buttonNext,
    ...HELPERS.fill,
  },
  btnTitleStyle: {
    ...FONTS.bold,
  },
  footer: {
    borderColor: COLORS.GREY_E4,
    borderTopWidth: 1,
  },
});

export default ManageGeneralRequestScreen;
