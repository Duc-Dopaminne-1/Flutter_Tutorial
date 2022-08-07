import React from 'react';
import {Image, Text, View} from 'react-native';

import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {normal} from '../../assets/theme/metric';
import Section from '../../components/Section';
import styles from './styles';

const Step = ({item}) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepTextView}>
        <Text style={{...FONTS.bold, color: COLORS.TEXT_DARK_10}}>{item.stepNumber}</Text>
        <Text style={{...FONTS.regular}}>{item.stepContent}</Text>
      </View>
      <View style={[styles.viewIconStep, {backgroundColor: item.iconBackgroundColor}]}>
        <Image source={item.icon} />
      </View>
    </View>
  );
};

const FourStepHome = ({data}) => {
  return (
    <Section sectionName={translate(STRINGS.TITLE_FOUR_STEP_HOME)} titleStyle={styles.sectionText}>
      <View style={{paddingHorizontal: normal}}>
        {data.map((item, index) => (
          <Step item={item} key={index} />
        ))}
      </View>
    </Section>
  );
};

export default React.memo(FourStepHome);
