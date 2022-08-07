import React from 'react';
import {Text, View} from 'react-native';

import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CopyIcon from '../../../../components/Button/CopyIcon';
import RatingComponent from '../../../../components/Rating/RatingComponent';
import {TOOLTIP_SIDE} from '../../../../components/TooltipView';
import styles from '../styles';

const PropertyGeneralInfo = ({
  postTitle,
  address,
  propertyCode,
  rating,
  comments,
  status,
  createdDate,
}) => {
  return (
    <>
      <Text style={styles.textProject}>
        {postTitle || 'Cho thuê căn hộ chung cư 65m2 dự án Heaven Cityview, Quận 8, TP.HCM'}
      </Text>
      <View style={HELPERS.row}>
        <Text style={styles.textAddress}>{address}</Text>
      </View>
      <View style={commonStyles.separatorRow8} />
      {!!propertyCode && (
        <View style={HELPERS.row}>
          <View style={styles.containerGray}>
            <Text style={commonStyles.blackTextBold14}>{propertyCode}</Text>
            <View style={commonStyles.separatorColumn8} />
            <CopyIcon
              tooltipSide={TOOLTIP_SIDE.top}
              content={propertyCode}
              icon={IMAGES.IC_COPY_NEW}
              iconStyles={styles.copyIcon}
            />
          </View>
          <View style={commonStyles.separatorColumn16} />
          {status?.isVisible && (
            <View style={[styles.statusTagContainer, status?.containerStyle]}>
              <Text style={[styles.statusTag, status?.statusTextStyle]}>{status?.statusText}</Text>
            </View>
          )}
        </View>
      )}
      <View style={HELPERS.fillRow}>
        <View style={HELPERS.fillRowSpaceBetween}>
          <Text style={[commonStyles.blackText14]}>
            {translate('propertyPost.createDateTime')}
            <Text style={[commonStyles.blackTextBold16]}>{`: ${createdDate}`}</Text>
          </Text>

          {!!rating && (
            <View style={[HELPERS.fillRow, HELPERS.mainEnd]}>
              <Text style={commonStyles.blackText14}>
                {translate('propertyPost.headerNav.rating')}
              </Text>
              <View style={commonStyles.separatorColumn8} />
              <RatingComponent rateNumber={rating} isFullView={false} isReverse />
            </View>
          )}
        </View>
        {!!comments && (
          <View style={[HELPERS.fillRow, HELPERS.mainEnd, METRICS.smallNormalMarginTop]}>
            <Text style={commonStyles.blackText14}>{translate('propertyPost.discussion')}</Text>
            <View style={commonStyles.separatorColumn8} />
            <Text style={commonStyles.blackTextBold14}>{comments}</Text>
          </View>
        )}
      </View>
    </>
  );
};

export default PropertyGeneralInfo;
