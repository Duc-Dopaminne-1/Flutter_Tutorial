import React from 'react';
import {Image, Text, View} from 'react-native';

import {IMAGES} from '../../../../assets/images';
import {HELPERS} from '../../../../assets/theme/helpers';
import {commonStyles} from '../../../../assets/theme/styles';
import LinkTextButton from '../../../../components/LinkTextButton';
import styles from '../styles';

export const ProjectHorizontalInfoCell = React.memo(({label, value, isActive, onPress}) => {
  const rightIcon = isActive ? (
    <Image
      source={IMAGES.ARROW_RIGHT_LINEAR}
      style={styles.projectInfoCellIconRight}
      resizeMode="contain"
    />
  ) : null;

  return (
    <View style={styles.cellHorizontal}>
      <Text style={[styles.cellLabelHorizontal]}>{label}</Text>
      <LinkTextButton
        style={styles.cellValueHorizontalProjectView}
        textStyle={styles.cellValueHorizontalProject(isActive)}
        onPress={onPress}
        title={value}
        rightIcon={rightIcon}
        disable={!isActive}
      />
    </View>
  );
});

export const HorizontalInfoCell = ({label, value, rightIcon}) => {
  return (
    <View style={styles.cellHorizontal}>
      <Text style={styles.cellLabelHorizontal}>{label}</Text>
      <View style={styles.cellValueContainer}>
        <Text style={[styles.cellValueHorizontal]}>{value}</Text>
        {rightIcon && (
          <>
            <View style={commonStyles.separatorColumn8} />
            {rightIcon}
          </>
        )}
      </View>
    </View>
  );
};

const InfoCell = ({label, value, style = {}, customStyleLabel, customStyleValue}) => {
  return (
    <View style={[styles.cell, HELPERS.mainCenter, style]}>
      <Text style={[commonStyles.blackText14, customStyleLabel]}>{label}</Text>
      <Text style={[styles.cellValue, customStyleValue]}>{value}</Text>
    </View>
  );
};

export default InfoCell;
