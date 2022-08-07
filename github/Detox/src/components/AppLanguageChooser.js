import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';

import {setAppLanguage} from '../appData/appSettings';
import {SIZES} from '../assets/constants/sizes';
import {languages, setMainLocaleLanguage, translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {METRICS} from '../assets/theme/metric';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 10,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.TEXT_DARK_10,
    ...METRICS.horizontalMargin,
  },
});

const AppLanguageChooser = () => {
  const dispatch = useDispatch();
  const onChangeToLanguage = language => {
    setMainLocaleLanguage(language);
    dispatch(setAppLanguage(language));
  };

  return (
    <View style={styles.container}>
      <Text>{translate(STRINGS.CHOOSE_APP_LANGUAGE)}</Text>
      {languages.map(item => (
        <Button
          testID={item.abbr}
          key={item.abbr}
          onPress={() => {
            onChangeToLanguage(item.abbr);
          }}
          title={item.label}
        />
      ))}
    </View>
  );
};

export default AppLanguageChooser;
