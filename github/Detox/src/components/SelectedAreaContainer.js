import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {IconButton} from 'react-native-paper';

import {GLOBAL_ACTIONS} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {COLORS} from '../assets/theme/colors';
import {getInterestedAreaString} from '../utils/UserAgentUtil';

const styles = StyleSheet.create({
  selectedAreaContainer: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedAreaItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
    height: 30,
    borderRadius: SIZES.BORDER_RADIUS_20,
    paddingLeft: 15,
    backgroundColor: COLORS.GREY_ED,
  },
});

const SelectedAreaContainer = ({state, dispatch}) => {
  const renderSelectedArea = (item, index) => {
    const removeArea = () => {
      if (index < state.workingAreas.length) {
        dispatch({type: GLOBAL_ACTIONS.REMOVE_WORKING_AREA, payload: state.workingAreas[index]});
      }
    };
    return (
      <View key={index} style={styles.selectedAreaItem}>
        <Text>
          {getInterestedAreaString({district: item?.district?.name, city: item?.city?.name})}
        </Text>
        <IconButton icon="close" color={COLORS.TEXT_DARK_10} size={20} onPress={removeArea} />
      </View>
    );
  };
  return (
    <View style={styles.selectedAreaContainer}>{state.workingAreas?.map(renderSelectedArea)}</View>
  );
};

export default SelectedAreaContainer;
