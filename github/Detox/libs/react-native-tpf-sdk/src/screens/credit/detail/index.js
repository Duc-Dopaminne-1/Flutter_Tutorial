import {
  getLoanProductDetailClear,
  getLoanProductDetailHandle
} from '../../../redux/actions/credit';
import { useNavigation } from '@react-navigation/native';
import { getDepositMoneyHandler } from '../../../redux/actions/deposit';
import { getShowAlertError } from '../../../redux/actions/system';
import { CREDIT } from '../../../redux/actionsType';
import { ICCurrencyYellow } from '../../../assets/icons';
import { PrimaryButton, WithLoading } from '../../../components/';
import AppText from '../../../components/app_text';
import CustomWebview from '../../../components/custom_webview';
import GroupView from '../../../components/dynamic_view_form/group_view';
import { EVENT_TYPE } from '../../../constants/analyticEnums';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { REQUIRE_ID, REQUIRE_LOGIN } from '../../../constants/errors';
import { BORDER_RADIUS, SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import { formatNumber } from '../../../helpers/formatNumber';
import { handleTouch } from '../../../helpers/handleTouch';
import { validateNumberic } from '../../../helpers/validate';
import React, { useCallback, useEffect, useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { partnerItemSelector } from '../../../redux/selectors/partner';
import { MEMBER_TYPE } from '../../../global/member_type';
import { scale } from '../../../utils/responsive';
import { isIphoneX } from '../../../helpers/device';
import themeContext from '../../../constants/theme/themeContext';
import { TpfSdkClient } from '../../../../index';

const CreditProductDetail = props => {
  const navigation = useNavigation();
  const { text, fonts, app, icon } = useContext(themeContext) || {};
  const { route } = props;
  const productItem = route.params.item;
  const { role, memberId, topenId } = useSelector(state => state?.auth);
  const productDetail = useSelector(state => state.credit?.loanDetail);
  const { profile, topenIdProfile } = useSelector(state => state.member);
  const productFilter = useSelector(state => state.credit.productFilter);
  const orderMemo = useSelector(state => state.credit.orderMemo);
  const dispatch = useDispatch();
  const partner = useSelector(state => partnerItemSelector(state, productItem?.partnerId));
  useEffect(() => {
    dispatch(getLoanProductDetailHandle({ id: productItem?.id }));
    return () => {
      dispatch(getLoanProductDetailClear());
    };
  }, [dispatch, productItem]);

  const _onCreateRecords = useCallback(
    event => {
      handleTouch(event, 'CREATE_CREDIT', props?.route, topenId, EVENT_TYPE.CREATE_CREDIT);
      if (role && role === MEMBER_TYPE.Guest) {
        dispatch(getShowAlertError(REQUIRE_LOGIN));
      }
      if (MEMBER_TYPE.Guest !== role) {
        /// TODO
        // if (!profile?.passport && !profile?.idCard) {
        //   dispatch(
        //     getShowAlertError({
        //       ...REQUIRE_ID,
        //       confirmAction: () => navigation.navigate('ProfileScreen')
        //     })
        //   );
        //   return;
        // }
        dispatch(getDepositMoneyHandler());
        const form = {
          ...{
            ordersItem: {
              productId: productDetail?.id,
              name: productDetail.name,
              loanAmount: productFilter.loan,
              loanPeriod: productFilter.duration,
              categoryId: productFilter?.categoryId,
              categoryName: productFilter?.categoryName
            }
          },
          ...{
            partnerId: productDetail?.partnerId || partner?.id,
            partnerName: partner?.name,
            partnerImage: partner?.imageLink,
            memberTopener: {
              memberTopenerId: profile.id,
              memberTopenerLastName: topenIdProfile?.name || profile?.name
            }
          }
        };
        // For update product in credit order (Draft status)
        if (orderMemo.reuseForm) {
          TpfSdkClient?.requestLogin('CreateCreditStep1Screen', {
            form: {
              ...form,
              title: orderMemo.reuseForm.title,
              description: orderMemo.reuseForm.description
            },
            productInfo: productDetail,
            contactId: orderMemo.reuseForm?.contact?.entityId
          });
        } else {
          TpfSdkClient?.requestLogin('ScanInfoCreditScreen', {
            form,
            productInfo: productDetail
          });
        }
        return;
      }
    },
    [
      props?.route,
      topenId,
      role,
      dispatch,
      productDetail,
      productFilter,
      partner,
      profile,
      topenIdProfile,
      orderMemo.reuseForm,
      navigation
    ]
  );

  const loanLimit = productDetail?.loanLimit || productItem.loanLimit || 0;
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        <FastImage
          source={{ uri: productDetail?.image || productItem.image || '' }}
          style={styles.img}
        />
        <View style={styles.brandContainer}>
          <FastImage
            source={{
              uri: partner?.imageLink || ''
            }}
            style={styles.brand}
            resizeMode="contain"
          />
        </View>
        <View style={styles.overviewContainer}>
          <Text style={[styles.textTitle, { color: text.primary, fontFamily: fonts?.BOLD }]}>
            {productDetail?.name || productItem?.name}
          </Text>
          <View style={styles.currencyContainer}>
            <ICCurrencyYellow
              styles={styles.currencyIC}
              color1={icon?.color2}
              color2={icon?.color2}
            />
            <AppText translate semiBold style={[styles.currencyText, { color: app.primaryColor2 }]}>
              {'insurance_screen.maximum_limit'}
              {formatNumber(loanLimit || '0')}
              {validateNumberic(loanLimit) ? 'common.currency' : ''}
            </AppText>
          </View>
          <View style={styles.groupContainer}>
            <AppText translate style={[styles.textGroup]}>
              product_screen.product_groups
            </AppText>
            <View style={styles.listGroup}>
              <Text style={[styles.textType, { color: text.primary, fontFamily: fonts?.SEMIBOLD }]}>
                {productDetail?.categoryName}
              </Text>
            </View>
          </View>
          <View style={styles.groupContainer}>
            <AppText translate style={[styles.textGroup]}>
              product_screen.supplier
            </AppText>
            <Text style={[styles.textType, { color: text.primary, fontFamily: fonts?.SEMIBOLD }]}>
              {partner?.name}
            </Text>
          </View>
          <CustomWebview
            content={productDetail?.fullDescription || ''}
            style={{ paddingTop: SPACING.Medium, paddingBottom: 0 }}
          />
        </View>
        {productDetail?.listComponent?.length > 0
          ? productDetail?.listComponent?.map((component, index) => {
              return (
                <GroupView
                  key={'' + index}
                  style={styles.expandGroup}
                  {...{
                    group: {
                      name: component?.name,
                      eavAttribute: component?.listAttributeDetail
                    }
                  }}
                />
              );
            })
          : null}
      </ScrollView>
      <View style={styles.action}>
        <PrimaryButton
          translate
          title={'screen_name.create_loan_profile'}
          onPress={_onCreateRecords}
        />
      </View>
    </View>
  );
};

export default WithLoading(CreditProductDetail, [CREDIT.GET_LOAN_PRODUCT_DETAIL.HANDLER]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Whisper
  },
  img: {
    width: '100%',
    height: scale(207)
  },
  body: {
    flex: 1
  },
  overviewContainer: {
    backgroundColor: CUSTOM_COLOR.White,
    paddingHorizontal: SPACING.Medium
  },
  textTitle: {
    fontSize: FONT_SIZE.Title3,
    lineHeight: FONT_SIZE.Title3,
    paddingTop: SPACING.Large
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.Normal
  },
  currencyText: {
    marginLeft: scale(6),
    fontSize: FONT_SIZE.BodyText
  },
  currencyIC: {
    width: scale(16),
    height: scale(16)
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.Normal
  },
  textGroup: {
    fontSize: FONT_SIZE.BodyText
  },
  textType: {
    fontSize: FONT_SIZE.BodyText
  },
  description: {
    color: CUSTOM_COLOR.GreenBold,
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    paddingVertical: SPACING.Medium
  },
  groupCallSupport: {
    alignSelf: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.Normal,
    paddingBottom: SPACING.Medium
  },
  scrollView: {
    paddingBottom: SPACING.HtmlBottom
  },
  action: {
    ...Shadow,
    backgroundColor: BACKGROUND_COLOR.Primary,
    paddingVertical: SPACING.Medium,
    paddingBottom: isIphoneX ? 0 : SPACING.Medium,
    paddingHorizontal: SPACING.Medium
  },
  expandGroup: {
    marginTop: SPACING.Medium,
    marginHorizontal: SPACING.Medium
  },
  listGroup: {
    flex: 1,
    marginLeft: SPACING.Normal,
    alignItems: 'flex-end'
  },
  brand: {
    width: scale(40),
    height: scale(40)
  },
  brandContainer: {
    position: 'absolute',
    left: scale(16),
    top: scale(143),
    zIndex: 999,
    width: scale(48),
    height: scale(48),
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
