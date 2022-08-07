import React, { useState, useRef, useEffect } from 'react';
import {
  ImageBackground,
  View,
  Image,
  ImageSourcePropType
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
import BACKGROUND_ONBOARDING from '@res/Onboarding/bg-onboarding.png';
import ICON_LOGO from '@res/Onboarding/icon-logo.png';
import ICON_CONVENIENT from '@res/Onboarding/icon-convenient.png';
import ICON_GOOD_CONNECTION from '@res/Onboarding/icon-good-connection.png';
import ICON_SECURITY_INFO from '@res/Onboarding/icon-security-info.png';
import { CustomText } from '@src/components/CustomText';
import { CustomButton } from '@src/components/CustomButton';
import translate from '@src/localize';
import styles from './styles';
import NavigationActionsService from '@src/navigation/navigation';
import { LOGIN, LOGIN_TENANT } from '@src/constants/screenKeys';
import { resetAllState } from '@src/modules/auth/actions';
import { useDispatch } from 'react-redux';
import Container from '@src/components/Container';

Icon.loadFont();

const dummyData = [
  {
    logo: ICON_LOGO,
    slogan: 'Best Solutions For Your Building',
    image: ICON_CONVENIENT,
    title: 'CONVENIENT',
    description: 'Convenient use via the app, you can use the utility of the app, manage all data of tenant of the building.'
  },
  {
    logo: ICON_LOGO,
    slogan: 'Best Solutions For Your Building',
    image: ICON_GOOD_CONNECTION,
    title: 'GOOD CONNECTION',
    description: 'Connecting tenants with each other through the store, tenants can sell various things to each other in the building'
  },
  {
    logo: ICON_LOGO,
    slogan: 'Best Solutions For Your Building',
    image: ICON_SECURITY_INFO,
    title: 'SECURITY INFO',
    description: 'Strict security helps users to be assured of data and information during the use of the application'
  }
];

interface Item {
  logo: ImageSourcePropType;
  slogan: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
}

const OnboardingItemTenant = (key: any, item: Item) => {
  return (
    <View key={key} style={styles.slide}>
      <View style={styles.viewLogo}>
        <Image source={item.logo} />
        <CustomText style={styles.textSlogan} text={item.slogan} />
      </View>

      <View style={styles.iconLogo}>
        < Image source={item.image} resizeMode='contain' />
      </View>

      <View style={styles.viewTitle}>
        <CustomText style={styles.title} text={item.title} />
        <CustomText style={styles.text} text={item.description} />
      </View>
    </View >
  );
};

interface Props {
  imageBackground: ImageSourcePropType,
  items: Item[],
  componentId: any
}

const OnboardingTenant = (props: Props) => {
  const [indexSide, setIndexSide] = useState(0);
  const swiper = useRef(null);
  const { imageBackground = BACKGROUND_ONBOARDING, items = dummyData } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetAllState());
  }, []);

  const onSkip = () => {
    NavigationActionsService.setRoot(LOGIN_TENANT);
  };

  const onNext = () => {
    if (indexSide + 1 <= items.length - 1) {
      //@ts-ignore
      swiper.current.scrollTo(indexSide + 1);
    } else {
      NavigationActionsService.setRoot(LOGIN_TENANT);
    }
  };

  return (
    <Container barStyle={'light-content'}>
      <ImageBackground source={imageBackground} style={styles.imageBackground}>
        <Swiper
          ref={swiper}
          style={styles.wrapper}
          showsButtons={false}
          loop={false}
          onIndexChanged={(index) => setIndexSide(index)}
          dotColor='white'>
          {items.length !== 0 && items.map((item, index) => {
            return OnboardingItemTenant(index, item);
          })}
        </Swiper>
        <View style={styles.viewBottom}>
          <View style={styles.viewBottomChildren}>
            {indexSide == items.length - 1
              ? null
              : <CustomButton text={translate('upload_collection.skip')}
                style={styles.skip}
                textStyle={styles.skipText}
                onPress={onSkip} />
            }
            <View style={styles.viewSpace} />
            <CustomButton
              text={indexSide == items.length - 1 ? translate('bookReader.button_finish') : translate('bookReader.button_next')}
              style={styles.skip}
              textStyle={styles.skipText}
              onPress={onNext}
            />
          </View>
        </View>

      </ImageBackground >

    </Container>
  );
};


export default OnboardingTenant;
