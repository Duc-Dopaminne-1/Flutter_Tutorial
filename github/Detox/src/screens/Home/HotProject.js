import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import CustomButton from '../../components/Button/CustomButton';
import ImageProgress from '../../components/ImageProgress';
import styles from './styles';

const MAX_TITLE_LINE = 2;
const HotProject = ({url, onPress, title = ''}) => {
  return (
    <View style={styles.hotProjectContainer}>
      <ImageProgress
        url={url}
        containerStyle={styles.hotProjectImageContainer}
        imageContainerStyle={styles.hotProjectImageContainer}
        imageStyle={styles.hotProjectImage}
      />
      <TouchableOpacity onPress={onPress} style={styles.hotProjectBottomContainer}>
        <Text style={styles.hotProjectTextfirst}>
          {translate(STRINGS.PROJECT_OPEN_FOR_BOOKING)}
        </Text>
        <Text
          textBreakStrategy={'simple'}
          numberOfLines={MAX_TITLE_LINE}
          style={styles.hotProjectTextSecond}>
          {title?.toLocaleUpperCase()}
        </Text>
        <CustomButton
          style={styles.bookingButton}
          title={translate(STRINGS.BOOKING_NOW)}
          titleStyle={styles.bookingButtonText}
          onPress={onPress}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HotProject;
