import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS, normal, small, tiny} from '../../../../assets/theme/metric';
import Avatar from '../../../../components/Avatar';
import {SectionComponent} from './DetailTransactionComponents';

const AVATAR_SIZE = 40;

const styles = StyleSheet.create({
  viewInfor: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    paddingLeft: normal,
    paddingRight: 11,
    marginVertical: 10,
    paddingTop: 2,
  },
  sellAgentInfo: {
    marginTop: small,
  },
  sellAgentText: {
    ...FONTS.regular,
    fontSize: 10,
  },
  nameText: {
    ...FONTS.semiBold,
    fontSize: 15,
  },
  viewLine: {
    height: 1,
    backgroundColor: COLORS.SEPARATOR_LINE,
  },
  valueRowInfo: {
    flexDirection: 'row',
    paddingTop: tiny,
    marginBottom: small,
    flexWrap: 'wrap',
  },
  projectValueInfo: {
    flexDirection: 'row',
    paddingTop: tiny,
    marginBottom: tiny,
  },
  valueLastRowInfo: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  infoLabel: {
    ...FONTS.regular,
    fontSize: 13,
    color: COLORS.GRAY_BD,
  },
  infoValue: {
    ...FONTS.semiBold,
    fontSize: 15,
  },
  separateVerticalLine: {
    width: 1,
    backgroundColor: COLORS.GRAY_BD,
    marginHorizontal: small,
  },
  propertySmallLabel: {
    ...FONTS.regular,
    fontSize: 12,
  },
  propertySmallValue: {
    ...FONTS.semiBold,
    fontSize: 13,
  },
  viewAgentName: {
    ...HELPERS.mainSpaceAround,
    marginLeft: small,
    flexShrink: 1,
  },
});

const SellAgentInfo = ({data}) => {
  if (!data) {
    return null;
  }
  return (
    <View style={styles.sellAgentInfo}>
      <View style={[HELPERS.row, METRICS.smallMarginBottom]}>
        <Avatar size={AVATAR_SIZE} url={data.profilePhoto} />
        <View style={styles.viewAgentName}>
          <Text style={styles.sellAgentText}>
            {translate('project.filterConsultant.consultant')}
          </Text>
          <Text style={styles.nameText}>{data.fullName}</Text>
        </View>
      </View>
      <View style={styles.viewLine} />
    </View>
  );
};

const CustomerInfo = ({data}) => {
  if (!data) {
    return null;
  }
  return (
    <View style={styles.sellAgentInfo}>
      <Text style={styles.infoLabel}>{translate(STRINGS.CUSTOMER_INFOR)} </Text>
      <View style={styles.valueRowInfo}>
        <Text style={styles.infoValue}>{data.customerFullName}</Text>
        <View style={styles.separateVerticalLine} />
        <Text style={styles.infoValue}>{data.customerPhoneNumber}</Text>
      </View>
      <View style={styles.viewLine} />
    </View>
  );
};

const PropertyInfo = ({data}) => {
  if (!data) {
    return null;
  }
  return (
    <View style={styles.sellAgentInfo}>
      <Text style={styles.infoLabel}>{translate(STRINGS.PRODUCT_INFORMATION)}</Text>
      <View style={styles.projectValueInfo}>
        <Text style={styles.propertySmallLabel}>{`${translate(STRINGS.PROJECT)}: `}</Text>
        <View style={HELPERS.flexShrink}>
          <Text style={styles.propertySmallValue}>{data.projectName}</Text>
        </View>
      </View>
      <View style={styles.valueLastRowInfo}>
        <Text style={styles.propertySmallValue}>{data.propertyCode}</Text>
        <View style={styles.separateVerticalLine} />
        {data.floor && (
          <>
            <Text style={styles.propertySmallValue}>{`${translate(STRINGS.FLOOR)} ${
              data.floor
            }`}</Text>
            <View style={styles.separateVerticalLine} />
          </>
        )}
        <Text style={styles.propertySmallValue}>{data.blockName}</Text>
      </View>
    </View>
  );
};

const AgentAndCustomerInfo = ({data}) => {
  return (
    <SectionComponent
      title={translate(STRINGS.PARTNER_AND_CUSTOMER_INFORMATION)}
      subTitle={data.startTransactionDateTime}>
      <View style={styles.viewInfor}>
        <SellAgentInfo data={data?.rawData?.consultantInfo} />
        <CustomerInfo data={data} />
        <PropertyInfo data={data} />
      </View>
    </SectionComponent>
  );
};

export default AgentAndCustomerInfo;
