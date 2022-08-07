import React, {useRef} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {useGetRequesterByIdQuery, UserDto} from '../../../api/graphql/generated/graphql';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import {SizeBox} from '../../../components/SizeBox';
import {GeneralRequest} from '../utils/generalRequestUtils';
import ListPropertySuggestion from './ListPropertySuggestion';

type RequestInformationViewProps = {
  generalRequest?: GeneralRequest,
  userInfo?: UserDto,
};

const RequestInformationView = ({
  generalRequest = null,
  userInfo = null,
  onPressEdit = () => {},
}: RequestInformationViewProps) => {
  const {phoneNumber, userName, email} = userInfo || {};

  const postRef = useRef();

  const {data: requester} = useGetRequesterByIdQuery({
    skip: !generalRequest?.requesterId || generalRequest?.requesterIsBuyer,
    variables: {
      customerId: generalRequest?.requesterId,
    },
  });

  const {customerById} = requester || {};
  const {customerEmail, customerFullName, customerPhone} = customerById || {};

  const requesterPhone = generalRequest?.requesterIsBuyer ? phoneNumber : customerPhone;
  const requesterEmail = generalRequest?.requesterIsBuyer ? email : customerEmail;
  const requesterFullName = generalRequest?.requesterIsBuyer ? userName : customerFullName;

  return (
    <View style={HELPERS.fill}>
      <ListPropertySuggestion
        ref={postRef}
        c2CDemandId={generalRequest?.c2CDemandId}
        isInterested={generalRequest?.isInterested}
        forSale={generalRequest?.forSale}
        HeaderComponent={() => (
          <>
            <View style={styles.sectionContainer}>
              <View style={[styles.row, METRICS.smallMarginBottom, HELPERS.crossCenter]}>
                <Text style={styles.sectionHeader}>
                  {translate('c2CGeneralRequest.requestInfo')}
                </Text>

                <Pressable onPress={onPressEdit}>
                  <Text style={styles.editText}>{translate('c2CGeneralRequest.adjust')}</Text>
                </Pressable>
              </View>

              <View style={[styles.row, METRICS.smallMarginTop]}>
                <Text style={styles.label}>{translate(STRINGS.TITLE)}:</Text>
                <Text style={styles.value}>{generalRequest?.title}</Text>
              </View>
              <View style={[styles.row, METRICS.smallMarginTop]}>
                <Text style={styles.label}>{translate(STRINGS.BDS_PROPERTY_TYPE)}:</Text>
                <Text style={styles.value}>{generalRequest?.propertyTypeName}</Text>
              </View>
              <View style={[styles.row, METRICS.smallMarginTop]}>
                <Text style={styles.label}>{translate(STRINGS.AREA)}:</Text>
                <Text style={styles.value}>{generalRequest?.areas}</Text>
              </View>
              <View style={[styles.row, METRICS.smallMarginTop]}>
                <Text style={styles.label}>{translate(STRINGS.PRICE)}:</Text>
                <Text style={styles.value}>{generalRequest?.priceRange}</Text>
              </View>
              <View style={[styles.row, METRICS.smallMarginTop]}>
                <Text style={styles.label}>{translate(STRINGS.ACREAGE)}:</Text>
                <Text style={styles.value}>{generalRequest?.squareRange}</Text>
              </View>
            </View>
            <SizeBox height={SIZES.FONT_12} />
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionHeader, METRICS.smallMarginBottom]}>
                {translate(STRINGS.REQUEST_BUYER_INFO)}
              </Text>
              <View style={[styles.row, METRICS.smallMarginTop]}>
                <Text style={styles.label}>{translate(STRINGS.FULLNAME)}:</Text>
                <Text style={styles.value}>{requesterFullName}</Text>
              </View>
              <View style={[styles.row, METRICS.smallMarginTop]}>
                <Text style={styles.label}>{translate(STRINGS.PHONE_NUMBER)}:</Text>
                <Text style={styles.value}>{requesterPhone}</Text>
              </View>
              <View style={[styles.row, METRICS.smallMarginTop]}>
                <Text style={styles.label}>{translate(STRINGS.EMAIL)}:</Text>
                <Text style={styles.value}>{requesterEmail}</Text>
              </View>
            </View>
            <SizeBox height={SIZES.FONT_12} />
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  value: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.TEXT_BLACK,
    textAlign: 'right',
    flex: 1,
  },
  editText: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_14,
    color: COLORS.PRIMARY_A100,
    textAlign: 'right',
    flex: 1,
  },
  label: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.TEXT_DARK_40,
    marginRight: small,
  },

  sectionContainer: {
    ...METRICS.horizontalPadding,
    paddingVertical: SIZES.PADDING_16,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  sectionHeader: {
    ...commonStyles.blackTextBold20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default RequestInformationView;
