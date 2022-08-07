import {useNavigation} from '@react-navigation/native';
import React, {
  forwardRef,
  memo,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';

import {
  SearchPropertyPostOrderBy,
  useSearchPropertyPostsOnC2CDemandForRentLazyQuery,
  useSearchPropertyPostsOnC2CDemandForSaleLazyQuery,
  useSkipPropertyPostC2CDemandMutation,
  useUserInterestedC2CDemandMutation,
} from '../../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/appContext';
import {SIZES} from '../../../assets/constants/sizes';
import {FONT_BOLD} from '../../../assets/fonts';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import LazyList, {PAGING_TYPE} from '../../../components/LazyList';
import C2CPropertyItem from '../../../components/PropertyItem/C2CPropertyItem';
import {getGuaranteedStatusStyle} from '../../../components/PropertyItem/PropertyItemGuarantee';
import {extractAddressData} from '../../../utils/DataProcessUtil';
import {getPropertyPostApprovalStatusDescriptionById} from '../../../utils/GetMasterData';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';
import MeasureUtils from '../../../utils/MeasureUtils';
import {mapPropertyC2CGuarantee} from '../../Home/TopenerOfMonth/types';
import {useFormatPrice} from '../../Home/useFormatPrice';
import ScreenIds from '../../ScreenIds';

const APPROVAL_STATUS_ID = 'cd55e8d0-4491-4d51-9abe-27321918f1f3';

const ListPropertySuggestion = forwardRef(
  ({isInterested = false, c2CDemandId, forSale, HeaderComponent}, ref) => {
    const {showAppModal} = useContext(AppContext);
    const navigation = useNavigation();
    const [toggle, setToggle] = useState(isInterested);
    const [totalCount, setTotalCount] = useState(0);
    const [skipPropertyId, setSkipPropertyId] = useState(null);
    const propertyPostRef = useRef(null);

    const {getMasterData} = useContext(AppContext);
    const {formatPrice} = useFormatPrice();

    useEffect(() => {
      if (isInterested) {
        setToggle(isInterested);
      }
    }, [isInterested]);

    useImperativeHandle(ref, () => ({
      reload: () => {},
    }));

    const onChangeNotifySuccess = () => {
      setToggle(!toggle);
    };

    const skipPropertyPostC2CDemandSuccess = () => {
      setSkipPropertyId(propertyPostRef?.current);
    };

    const onChangeNotifyError = () => {};

    const {startApi: skipPropertyPostC2CDemand} = useMutationGraphql({
      showSpinner: true,
      graphqlApiLazy: useSkipPropertyPostC2CDemandMutation,
      onSuccess: skipPropertyPostC2CDemandSuccess,
    });

    const {startApi: updateReceiveNotificationC2CDemand} = useMutationGraphql({
      showSpinner: true,
      graphqlApiLazy: useUserInterestedC2CDemandMutation,
      onSuccess: onChangeNotifySuccess,
      onError: onChangeNotifyError,
    });

    const onChangeNotify = value => () => {
      if (c2CDemandId) {
        updateReceiveNotificationC2CDemand({
          variables: {
            request: {
              c2CDemandId,
              isInterested: value,
            },
          },
        });
      }
    };

    const toggleSwitch = value => {
      const title = translate('c2CGeneralRequest.confirmInformation');
      const message = value
        ? translate('c2CGeneralRequest.confirmInformationTurnOnMessage')
        : translate('c2CGeneralRequest.confirmInformationTurnOffMessage');
      showAppModal({
        isVisible: true,
        title,
        message,
        cancelText: translate(STRINGS.DISCARD),
        okText: translate(STRINGS.APPLY),
        onOkHandler: onChangeNotify(value),
      });
    };

    const onSkipPost = propertyPostId => () => {
      if (propertyPostId) {
        skipPropertyPostC2CDemand({
          variables: {
            request: {
              c2CDemandId,
              propertyPostId,
            },
          },
        });
      }
    };

    const onToggleSkipPost = propertyPostId => () => {
      propertyPostRef.current = propertyPostId;
      const title = translate('c2CGeneralRequest.skipPost');
      const message = translate('c2CGeneralRequest.skipPostMessage');
      showAppModal({
        isVisible: true,
        title,
        message,
        cancelText: translate(STRINGS.DISCARD),
        okText: translate(STRINGS.DELETE),
        onOkHandler: onSkipPost(propertyPostId),
      });
    };

    const approvalStatusJson = JSON.stringify([{id: APPROVAL_STATUS_ID}]);

    const getStatusName = item => {
      const status = getPropertyPostApprovalStatusDescriptionById(
        getMasterData(),
        item.propertyPostApprovalStatusId,
      );
      return status;
    };

    const renderItem = ({item}) => {
      const mappingItem = {
        ...mapPropertyC2CGuarantee(item, formatPrice, true),
        status: getStatusName(item),
        ...getGuaranteedStatusStyle({
          item: {...item, forRent: 1},
          masterData: getMasterData(),
        }),
        address: extractAddressData(item.propertyAddressDto, false),
        C2CSkipComponent: () => (
          <View style={styles.wrapperCenter}>
            <CustomButton
              style={[styles.footerButtonCancel]}
              title={translate(STRINGS.SKIP)}
              onPress={onToggleSkipPost(item?.propertyPostId)}
              titleStyle={[styles.footerButtonCancelTitle]}
            />
          </View>
        ),
      };

      const onPressItem = () => {
        navigation.navigate(ScreenIds.ViewPropertyPost, {
          propertyPostId: mappingItem?.propertyPostId,
          viewByOtherMode: false,
        });
      };

      return (
        <View style={styles.itemContainer}>
          <C2CPropertyItem
            item={mappingItem}
            onPress={onPressItem}
            mode={'saved-post'}
            isShowFollow
            customBtnFollowStyle={styles.customBtnFollowStyle}
          />
        </View>
      );
    };

    const onChangeData = ({totalCount: total}) => {
      setTotalCount(total ?? 0);
    };

    if (!c2CDemandId) return null;

    const queryOptions = {
      useQuery: forSale
        ? useSearchPropertyPostsOnC2CDemandForSaleLazyQuery
        : useSearchPropertyPostsOnC2CDemandForRentLazyQuery,
      variables: {
        input: {
          c2CDemandId: c2CDemandId ?? '',
          propertyPostApprovalStatusJson: approvalStatusJson,
          orderBy: SearchPropertyPostOrderBy.Latest,
        },
      },
      responseDataKey: forSale
        ? 'searchPropertyPostsOnC2CDemandForSale'
        : 'searchPropertyPostsOnC2CDemandForRent',
    };

    return (
      <LazyList
        renderItem={renderItem}
        useQuery={queryOptions.useQuery}
        queryOptions={{variables: queryOptions.variables}}
        itemHeight={item => ItemC2CPropertyHeight(item)}
        extractArray={response => {
          return response?.[queryOptions.responseDataKey]?.propertyPostForC2CDemandDtos ?? [];
        }}
        extractTotalCount={response => {
          return response?.[queryOptions.responseDataKey]?.totalCount ?? 0;
        }}
        removedItemId={skipPropertyId}
        uniqueKey="propertyPostId"
        onDataChange={onChangeData}
        pagingType={PAGING_TYPE.OFFSET}
        visibleEmpty={false}
        renderHeader={() => (
          <PropertySuggestionHeader
            totalCount={totalCount}
            toggle={toggle}
            onToggle={toggleSwitch}
            HeaderComponent={HeaderComponent}
          />
        )}
        containerStyle={styles.containerStyle}
        contentStyle={styles.contentStyle}
      />
    );
  },
);

const PropertySuggestionHeader = ({
  totalCount,
  toggle,
  onToggle = () => {},
  HeaderComponent = <></>,
}) => {
  return (
    <View style={styles.header}>
      <HeaderComponent />
      <View style={styles.listSection}>
        <Text style={[commonStyles.blackTextBold20, METRICS.smallMarginBottom]}>
          {translate(STRINGS.PROPERTY_POST_SUGGESTION)} ({totalCount})
        </Text>
        <View style={styles.notificationContainer}>
          <Text>{translate('c2CGeneralRequest.receiveNotification')}</Text>
          <Switch
            trackColor={{false: COLORS.NEUTRAL_DISABLE, true: COLORS.PRIMARY_A100}}
            thumbColor={COLORS.NEUTRAL_WHITE}
            ios_backgroundColor={COLORS.NEUTRAL_WHITE}
            onValueChange={onToggle}
            value={toggle}
          />
        </View>
      </View>
    </View>
  );
};

const HEIGHT = {
  banner: 257,
  header: {
    margin: SIZES.MARGIN_4,
    address: 22,
  },
  center: 48,
  bottom: 48,
  border: SIZES.BORDER_WIDTH_1,
  padding: SIZES.PADDING_12,
  paddingScreen: SIZES.PADDING_16,
  marginItem: SIZES.MARGIN_16,
};

const ItemC2CPropertyHeight = async item => {
  const widthSeparator = HEIGHT.padding * 2 + HEIGHT.paddingScreen * 2;
  const titleHeight = await MeasureUtils.measureTextSize({
    fontSize: SIZES.FONT_16,
    fontFamily: FONT_BOLD,
    text: item.postTitle,
    width: SCREEN_SIZE.WIDTH - widthSeparator - HEIGHT.border * 2,
    lineInfoForLine: 2,
  });
  const heightHeader =
    titleHeight.height + HEIGHT.header.margin + HEIGHT.header.address + HEIGHT.padding * 2;
  let itemHeight = HEIGHT.banner + heightHeader + HEIGHT.center + HEIGHT.bottom + HEIGHT.marginItem;
  itemHeight = itemHeight - HEIGHT.bottom;
  return itemHeight + 60;
};

const styles = StyleSheet.create({
  notificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  containerStyle: {
    paddingHorizontal: 0,
  },
  contentStyle: {
    paddingHorizontal: 0,
  },
  listSection: {
    ...METRICS.horizontalPadding,
    ...METRICS.verticalPadding,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  itemContainer: {
    ...METRICS.horizontalPadding,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  wrapperCenter: {
    borderTopWidth: HEIGHT.border,
    borderColor: COLORS.NEUTRAL_BORDER,
    paddingHorizontal: SIZES.PADDING_12,
    alignItems: 'center',
    paddingVertical: SIZES.PADDING_12,
  },
  footerButtonCancel: {
    borderColor: COLORS.PRIMARY_A100,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderWidth: SIZES.BORDER_WIDTH_1,
    width: '100%',
    height: SIZES.HEIGHT_BUTTON_32,
    borderRadius: SIZES.BORDER_RADIUS_8,
  },
  footerButtonCancelTitle: {
    color: COLORS.PRIMARY_A100,
    ...FONTS.bold,
    ...FONTS.fontSize14,
  },
  customBtnFollowStyle: {
    position: 'absolute',
    top: SIZES.SEPARATOR_16,
    right: SIZES.SEPARATOR_24,
  },
});

export default memo(ListPropertySuggestion);
