import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {IconButton} from 'react-native-paper';

import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal} from '../../../assets/theme/metric';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: normal,
    marginRight: 10,
  },
  label: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.GREY_82,
  },
  value: {
    ...FONTS.bold,
    fontSize: 14,
    color: COLORS.STATE_ERROR,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonTitle: {
    ...FONTS.bold,
    fontSize: 12,
    color: COLORS.PRIMARY_A100,
    textAlign: 'right',
  },
  buttonIcon: {
    padding: 0,
    margin: 0,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.SEPARATOR_LINE,
    marginHorizontal: normal,
    marginTop: normal,
  },
});

export type SelectFloorProps = {
  selectedFloors: [string],
  onPress: () => {},
};

export const SelectFloor = (props: SelectFloorProps) => {
  const selectedOnTotal = `${props.selectedFloors.join(', ')}/${props.totalFloor}`;
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>
          {`${translate('project.slot.displayFloor')}: `}
          <Text style={styles.value}>{selectedOnTotal}</Text>
        </Text>
        <TouchableOpacity style={styles.buttonContainer} onPress={props.onPress}>
          <Text style={styles.buttonTitle}>{translate('project.slot.chooseAnotherFloor')}</Text>
          <IconButton
            icon="chevron-right"
            color={COLORS.PRIMARY_A100}
            size={14}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
    </>
  );
};
