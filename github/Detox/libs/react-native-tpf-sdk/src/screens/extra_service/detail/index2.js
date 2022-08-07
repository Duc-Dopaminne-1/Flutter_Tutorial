import { useNavigation } from '@react-navigation/native';
import {
  getExtraServiceDetailClear,
  getExtraServiceDetailHandle
} from '../../../redux/actions/extraService';
import { getShowAlertError } from '../../../redux/actions/system';
import Divider from '../../../components/divider';
import { BodyText, PrimaryButton, Title3 } from '../../../components/';
import GroupView from '../../../components/dynamic_view_form/group_view';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';

import { REQUIRE_ID, REQUIRE_LOGIN } from '../../../constants/errors';
import { BORDER_RADIUS, DEVICE_WIDTH, SPACING } from '../../../constants/size';
import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { MEMBER_TYPE } from '../../../global/member_type';
import { scale } from '../../../utils/responsive';
import CustomWebview from '../../../components/custom_webview';
import { WithLoading } from '../../../components/';
import { EXTRA_SERVICE } from '../../../redux/actionsType';
import SCREENS_NAME from '../../../constants/screens';
import { handleTouch } from '../../../helpers/handleTouch';
import { EVENT_TYPE } from '../../../constants/analyticEnums';
import { useCallback } from 'react';
import ModalSelectPartner from './components/modal_select_product';
import { isIphoneX } from '../../../helpers/device';

const ExtraServiceDetail = props => {
  const { item } = props.route.params;
  const modalPartnerRef = useRef(null);
  const detailItem = useSelector(state => state.extraService?.detail);
  const listComponent = detailItem?.listComponent || [];
  const profile = useSelector(state => state.member.profile);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    // navigation.setOptions({ title: item?.name || 'No name', translate: false });
    dispatch(getExtraServiceDetailHandle({ CategoryId: item?.id || 0 }));
    return () => {
      dispatch(getExtraServiceDetailClear());
    };
  }, [item, dispatch, navigation]);

  const { role, topenId } = useSelector(state => state?.auth);
  const onPressNext = useCallback(
    event => {
      handleTouch(
        event,
        'CREATE_EXTRA_SERVICE',
        props?.route,
        topenId,
        EVENT_TYPE.CREATE_EXTRA_SERVICE
      );

      if (role && role === MEMBER_TYPE.Guest) {
        dispatch(getShowAlertError(REQUIRE_LOGIN));
      }

      if (MEMBER_TYPE.Guest !== role) {
        /// TODO
        // if (!profile?.passport && !profile?.idCard && !profile?.cmnd) {
        //   dispatch(
        //     getShowAlertError({
        //       ...REQUIRE_ID,
        //       confirmAction: () => navigation.navigate('ProfileScreen')
        //     })
        //   );
        //   return;
        // }
        if (detailItem.productViewType == 1) {
          //only 1 product
          handleNavigateCreateScreen(detailItem.id, detailItem.name, detailItem?.partnerId);
        } else {
          modalPartnerRef?.current.open();
        }
      }
    },
    [dispatch, profile, navigation, item, role, topenId, detailItem, props?.route]
  );
  const handleNavigateCreateScreen = (productId, productName, partnerId) => {
    navigation.navigate(SCREENS_NAME.CREATE_EXTRA_SERVICE_ORDER_SCREEN, {
      id: productId,
      name: productName,
      partnerId
    });
  };
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.additionalServiceDetailsWrapper}
        contentContainerStyle={styles.wrapper}>
        <View>
          <FastImage
            source={{
              uri: detailItem?.image || item?.image || ''
            }}
            style={styles.image}
          />
          {detailItem?.partnerImage ? (
            <View style={styles.brandContainer}>
              <FastImage
                resizeMode="contain"
                source={{ uri: detailItem?.partnerImage }}
                style={styles.brand}
              />
            </View>
          ) : null}
        </View>
        <View style={styles.basicInfo}>
          <Title3>{detailItem?.name}</Title3>
          {detailItem?.productViewType == 1 && (
            <View style={styles.description}>
              <BodyText translate style={{ maxWidth: '50%' }}>
                {'product_screen.supplier'}
              </BodyText>
              <BodyText bold style={{ maxWidth: '50%' }}>
                {detailItem?.partnerName}
              </BodyText>
            </View>
          )}
          <CustomWebview
            content={detailItem?.fullDescription || ''}
            style={{ paddingTop: SPACING.Medium, paddingBottom: 0 }}
          />
        </View>

        {listComponent?.length > 0
          ? listComponent.map((component, index) => {
              return (
                <>
                  <Divider style={styles.divider} color={CUSTOM_COLOR.GrayLight} />
                  <GroupView
                    key={index + ''}
                    canExpand={false}
                    style={styles.expandGroup}
                    {...{
                      group: {
                        name: component?.name,
                        eavAttribute: component?.listAttributeDetail
                      }
                    }}
                  />
                </>
              );
            })
          : null}
      </ScrollView>
      <View style={styles.floatFooter}>
        <PrimaryButton
          translate
          style={styles.btnFloatFooter}
          title={'product_screen.registration'}
          onPress={onPressNext}
        />
      </View>
      <ModalSelectPartner
        data={detailItem?.productList}
        ref={modalPartnerRef}
        handleChoose={handleNavigateCreateScreen}
      />
    </View>
  );
};

export default WithLoading(ExtraServiceDetail, [EXTRA_SERVICE.GET_PRODUCT_DETAIL.HANDLER]);

const styles = StyleSheet.create({
  additionalServiceDetailsWrapper: {
    flex: 1
  },
  wrapper: {
    paddingBottom: SPACING.HtmlBottom
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  paginationStyle: {
    position: 'absolute',
    bottom: scale(12, false),
    height: scale(20, false),
    backgroundColor: 'transparent'
  },
  basicInfo: {
    width: DEVICE_WIDTH,
    paddingHorizontal: scale(16),
    paddingTop: scale(24, false),
    paddingBottom: scale(12, false),
    backgroundColor: BACKGROUND_COLOR.White
  },
  title: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.TOP_HEADER
  },
  image: {
    height: scale(210),
    width: DEVICE_WIDTH
  },
  description: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.Medium
  },
  content: {
    width: DEVICE_WIDTH,
    marginTop: scale(8),
    paddingHorizontal: scale(16),
    backgroundColor: BACKGROUND_COLOR.White,
    height: '100%'
  },
  floatFooter: {
    padding: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    backgroundColor: BACKGROUND_COLOR.White
  },
  expandGroup: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0,
    shadowRadius: 0,

    elevation: 0
  },
  divider: {
    height: scale(8)
  },

  brandContainer: {
    position: 'absolute',
    left: scale(12),
    bottom: scale(12),
    width: scale(48),
    height: scale(48),
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS,
    backgroundColor: BACKGROUND_COLOR.White
  },
  brand: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS
  }
});
