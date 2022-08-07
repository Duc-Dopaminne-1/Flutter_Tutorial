import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS, small, tiny} from '../../../../assets/theme/metric';
import ImageProgress from '../../../../components/ImageProgress';
import {extractAddressData} from '../../../../utils/DataProcessUtil';

const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  projectName: {
    ...FONTS.semiBold,
    color: COLORS.TEXT_DARK_10,
    fontSize: 15,
  },
  projectAddress: {
    ...FONTS.regular,
    color: COLORS.GREY_82,
    fontSize: 15,
    flexWrap: 'wrap',
  },

  projectOwner: {
    ...FONTS.regular,
    color: COLORS.GREY_82,
    fontSize: 15,
  },
  ownerName: {
    ...FONTS.bold,
    fontSize: 12,
    marginTop: 2,
    alignSelf: 'center',
    marginLeft: tiny,
    flex: 1,
    color: COLORS.TEXT_DARK_10,
  },

  hotProjectImageContainer: {
    minHeight: 70,
    width: 135,
    marginRight: small,
  },
});

const ProjectInfo = ({project}) => {
  return (
    <View style={[HELPERS.row, METRICS.smallMarginBottom]}>
      <ImageProgress
        url={project?.featurePhotos}
        containerStyle={styles.hotProjectImageContainer}
        imageContainerStyle={styles.hotProjectImageContainer}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.projectName}>{project?.projectName}</Text>
        <Text style={styles.projectAddress}>{extractAddressData(project?.projectAddress)}</Text>
        {!!project?.investorOwnerName && (
          <View style={[HELPERS.rowStartCenter]}>
            <Text style={styles.projectOwner}>
              {`${translate(STRINGS.INVESTOR)}: `}
              <Text style={styles.ownerName}>{project?.investorOwnerName}</Text>
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ProjectInfo;
