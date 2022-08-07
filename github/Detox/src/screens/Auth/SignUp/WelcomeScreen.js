import React from 'react';
import {FlatList, StatusBar, StyleSheet, Text, View} from 'react-native';

import {DATA_MODAL_WELLCOME} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';
import {excuteCallbackLoginSuccess} from '../../navigate';
import ScreenIds from '../../ScreenIds';
import ListItemWelcome from '../AuthComponents/ListItemWelcome';

const styles = StyleSheet.create({
  viewInside: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS_10,
    padding: 16,
  },
  titleText: {
    fontSize: 24,
    ...FONTS.regular,
    marginBottom: normal,
  },
  subtitleText: {
    fontSize: 15,
    ...FONTS.regular,
    marginTop: 5,
  },
  flatlist: {
    flexGrow: 1,
    marginTop: 20,
  },
  footerButton: {
    marginTop: 10,
  },
});

const WelcomeScreen = ({navigation}) => {
  const renderItem = item => {
    return <ListItemWelcome title={item.item.title} />;
  };
  const keyExtractor = (item, index) => index.toString();

  const onPressDismiss = () => {
    navigation.navigate(ScreenIds.MainStack);
    excuteCallbackLoginSuccess();
  };

  const onUpgradeToAgency = () => {
    navigation.replace(ScreenIds.RegisterAgent);
  };
  return (
    <SafeAreaScreenContainer>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.viewInside}>
        <Text style={styles.titleText}>{translate(STRINGS.CONGRATULATION)}</Text>
        <Text style={styles.subtitleText}>{translate(STRINGS.WELCOME_SUBTITLE)}</Text>
        <FlatList
          style={styles.flatlist}
          data={DATA_MODAL_WELLCOME}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
        <CustomButton
          title={translate(STRINGS.UPGRADE_TO_AGENCY)}
          style={[commonStyles.buttonNext, styles.footerButton]}
          titleStyle={{...FONTS.bold}}
          onPress={onUpgradeToAgency}
        />
        <CustomButton
          title={'Để sau'}
          titleColor={COLORS.GREY_82}
          titleStyle={{...FONTS.bold}}
          style={[commonStyles.buttonOutline, styles.footerButton]}
          onPress={onPressDismiss}
        />
      </View>
    </SafeAreaScreenContainer>
  );
};

export default WelcomeScreen;
