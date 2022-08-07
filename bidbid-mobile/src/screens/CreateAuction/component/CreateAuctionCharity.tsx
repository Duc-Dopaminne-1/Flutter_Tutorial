import React, { ReactElement, useState, memo, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import CustomButton from '@/components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { CHOOSE_CHARITY_SCREEN, REQUEST_ADDITIONAL_CHARITY_SCREEN } from '@/navigation/screenKeys';
import { FormikValues } from 'formik';
import { Charities } from '@/redux/auction';
import ErrorMessage from '@/components/ErrorMessage';
import { CreateAuctionTitle } from '@/screens/CreateAuction/component/CreateAuctionTitle';
import NextSVG from '@/components/SVG/NextSVG';
import { requestCharity } from '@/shared/global';

function CreateAuctionCharity({ setFieldValue, errors, setFieldError }: FormikValues): ReactElement {
  const navigation = useNavigation();
  const [item, setItem] = useState({
    name: language('defaultCharityName'),
    id: -1,
  });

  const onAddCharities = (value: Charities, keywordTmp) => {
    const { id } = value;
    setFieldValue('charities', id);
    setFieldError('charities', '');
    value['keywordTmp'] = keywordTmp;
    setItem(value);
  };

  useEffect(() => {
    const subscriber = requestCharity.subscribe((charity: any) => {
      if (charity) {
        onAddCharities(charity, charity.name);
      }
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, []);

  const onSelectCharity = () => {
    navigation.navigate(CHOOSE_CHARITY_SCREEN, {
      onAddCharities: onAddCharities,
      itemSelected: item,
    });
  };

  const handleRequestCharityPressed = () => {
    navigation.navigate(REQUEST_ADDITIONAL_CHARITY_SCREEN);
  };

  return (
    <View style={styles.container}>
      <CreateAuctionTitle isRequire title={language('charityName')} subTitle={language('bidbidDonates')} />
      <CustomButton
        onPress={onSelectCharity}
        wrapBtn={styles.wrapBtnDuration}
        containerStyle={styles.wrapCtnBtnDuration}
        textStyle={styles.textBtn}
        text={item.name}
        iconSecondStyle={styles.icon}
        numberOfLines={1}
        iconSecond={<NextSVG />}
      />
      <ErrorMessage errorValue={errors.charities} />
      <Pressable
        style={styles.requestCharityButton}
        onPress={handleRequestCharityPressed}
        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
      >
        <Text style={styles.requestCharityText}>{language('requestAdditionalCharity')}</Text>
      </Pressable>
    </View>
  );
}

export default memo(CreateAuctionCharity);

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  wrapBtnDuration: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  wrapCtnBtnDuration: {
    width: null,
    borderRadius: 10,
    height: 42,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderColor: colors.gray_400,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginTop: 14,
  },
  textBtn: {
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
    letterSpacing: 0,
    marginRight: 10,
    fontWeight: null,
  },
  icon: {
    height: 12,
    width: 12,
  },
  requestCharityButton: {
    marginLeft: 4,
    marginTop: 12,
  },
  requestCharityText: {
    fontFamily: fonts.family.PoppinsRegular,
    fontSize: fonts.size.s12,
    color: colors.blue_700,
    textDecorationLine: 'underline',
    textDecorationColor: colors.blue_700,
  },
});
