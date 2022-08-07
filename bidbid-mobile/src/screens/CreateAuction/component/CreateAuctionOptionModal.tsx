import React, { ReactElement, memo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomInitModal from '@/components/CustomInitModal';
import CustomHeader from '@/components/CustomHeader';
import CloseSvg from '@/components/SVG/CloseSVG';
import { CustomLine } from '@/components/CustomeLine';
import { colors, fonts } from '@/vars';
import { isIOS } from '@/shared/devices';
import CustomButton from '@/components/CustomButton';
import { language } from '@/i18n';
import NavigationActionsService from '@/navigation/navigation';
import { CREATE_AUCTION_RAFFLE_SCREEN } from '@/navigation/screenKeys';
import RaffleAuctionSVG from '@/components/SVG/RaffleAuctionSVG';
import CreateAuctionTitleOption from '@/screens/CreateAuction/component/CreateAuctionTitleOption';
import StartRedSVG from '@/components/SVG/StartRedSVG';

function CreateAuctionOptionModal(): ReactElement {
  const [isVisible, setIsVisible] = useState(false);
  const raffleRules = [language('raffleRuleSelling'), language('raffleRuleWinner'), language('raffleRuleMultiple')];

  const onPressRaffle = () => {
    setIsVisible(false);
    NavigationActionsService.push(CREATE_AUCTION_RAFFLE_SCREEN);
  };

  const onBackdropPress = () => {
    setIsVisible(false);
  };

  const onPressChooseRaffle = () => {
    setIsVisible(true);
  };

  const renderItem = (item: string, index: number) => {
    return (
      <View key={item + index} style={styles.wrapItem}>
        <View style={styles.wrapIconStart}>
          <StartRedSVG />
        </View>
        <Text style={styles.textRule}>{item}</Text>
      </View>
    );
  };

  return (
    <View>
      <CreateAuctionTitleOption title={language('chooseRaffleOption')} onPress={onPressChooseRaffle} icon={<RaffleAuctionSVG />} />
      <CustomInitModal onBackdropPress={onBackdropPress} isVisible={isVisible}>
        <View style={styles.container}>
          <CustomHeader
            leftIcon={<CloseSvg />}
            goBack={onBackdropPress}
            wrapIconStyle={styles.wrapIconClose}
            titleStyle={styles.title}
            containerStyle={styles.containerStyle}
            title={language('raffleOption')}
          />
          <CustomLine />

          {raffleRules.map(renderItem)}

          <CustomButton onPress={onPressRaffle} containerStyle={styles.btnContinue} text={language('createRaffleOption')} />
        </View>
      </CustomInitModal>
    </View>
  );
}

export default memo(CreateAuctionOptionModal);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: 40,
  },
  containerStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'space-between',
    backgroundColor: colors.transparent,
  },
  wrapIconClose: {
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.gray_900,
    fontWeight: isIOS ? '600' : 'bold',
    fontSize: fonts.size.s18,
  },
  btnContinue: {
    alignSelf: 'center',
    backgroundColor: colors.red_700,
    paddingVertical: 13,
    marginTop: 48,
    width: '90%',
    borderRadius: 36,
  },
  textRule: {
    flex: 1,
    marginLeft: 10,
    color: colors.gray_600,
    fontFamily: fonts.family.RobotoRegular,
    fontSize: fonts.size.s1,
    fontWeight: '400',
  },
  wrapItem: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 15,
  },
  wrapIconStart: {
    marginTop: 4,
  },
});
