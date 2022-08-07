import React, { useEffect, useState, useRef } from 'react';
import styles from './styles';
import { View, Image, Alert, KeyboardAvoidingView } from 'react-native';
import IC_APARTMENT from '@src/res/icons/icon_apartment.png';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import { CustomFlatList } from '@src/components/FlatList';
import Container from '@src/components/Container';
import translate from '@src/localize';
import NavigationActionsService from '@src/navigation/navigation';
import { APARTMENT_DETAILS_TENANT } from '@src/constants/screenKeys';
import CustomSectionHeader from '@src/components/CustomSection';
import { upperCase } from 'lodash';
import ApartmentItem from '@src/components/FlatListItem/ApartmentItem';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { getKeyboardAdvoidStyle } from '@src/utils';
import getStyles from '@src/utils/getStyles';
import { getUnitListMe } from '@src/modules/Units/actions';
import { LimitLoadMore } from '@src/constants/vars';
import { IUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import { ICompanyUnit } from '@reup/reup-api-sdk/src/api/company/unit/model';

const ApartmentsTenant = () => {
  const dispatch = useDispatch();
  const [isLoadedData, setLoadedData] = useState(false);
  const apartmentList = useSelector<RootState, IPagination<IUnit>>((state: RootState) => state.unit.listMyUnit);
  const flatList = useRef<any>(null);
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);

  useEffect(() => {
    if (isLoadedData && me && me.default_property) {
      onGetListApartment(1);
    }

  }, [me.default_property]);

  const onPressItem = (item: IUnit) => {
    NavigationActionsService.push(APARTMENT_DETAILS_TENANT, { item, flatList });
  };

  const _renderItem = (item: ICompanyUnit & IUnit) => {
    return <ApartmentItem
      item={item}
      onPress={onPressItem} />;
  };

  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer}>
        <Image source={LINE} style={styles.line} />
      </View>
    );
  };

  const onGetListApartment = (page: number, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    dispatch(
      getUnitListMe({
        page,
        limit: LimitLoadMore,
        onSuccess: () => {
          onLoadSuccess && onLoadSuccess();
          setLoadedData(true);
        },
        onFail: error => {
          onLoadFailure && onLoadFailure();
          setLoadedData(true);
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );

  };

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    onGetListApartment(page, onLoadSuccess, onLoadFailure);
  };

  const renderHeader = () => {
    return <CustomSectionHeader
      style={styles.sectionHeader}
      title={upperCase(translate("apartments.apartments"))}
      icon={IC_APARTMENT}
      isShowFilter={false}
    />;
  };

  const renderFlatList = () => {
    return (
      <View style={styles.flatListContainer}>
        <CustomFlatList
          ref={flatList}
          pullToRefresh={true}
          loadMore={true}
          hasNext={apartmentList.next}
          onLoad={onLoad}
          ItemSeparatorComponent={_itemSeparator}
          data={apartmentList.results}
          renderItem={_renderItem}
          contentContainerStyle={{ flexGrow: 1, }}
        />
      </View>
    );
  };

  return (
    <Container
      title={translate('apartments.apartments')}
      isShowHeader={true}
      spaceBottom={true}>
      <KeyboardAvoidingView
        style={getStyles('flex-1')}
        keyboardVerticalOffset={getKeyboardAdvoidStyle()}
        behavior={'padding'}>
        <View style={styles.container}>
          {renderHeader()}
          {renderFlatList()}
        </View>
      </KeyboardAvoidingView>
    </Container >
  );
};

export default ApartmentsTenant;
