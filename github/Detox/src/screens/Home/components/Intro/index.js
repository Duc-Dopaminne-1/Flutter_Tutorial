import React, {useMemo, useRef, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Portal} from 'react-native-portalize';
import Carousel from 'react-native-reanimated-carousel';

import {HOTLINE_NUMBER, HOTLINE_NUMBER_FORMAT} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {normal, small, tiny} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import ModalWithModalize from '../../../../components/Modal/ModalWithModalize';
import {useContactInfo} from '../../../../hooks';
import {SCREEN_SIZE} from '../../../../utils/ImageUtil';
import {pageData, slides, TypeChatData} from './data';
import useIntro, {useSliderIntro} from './useIntro';

const avatarSize = 32;
const ITEM_HEIGHT = 418;

const ChatItem = ({
  isSent = false,
  message = 'Bạn cần hỗ trợ gì ?',
  message2 = '',
  name,
  avatar = false,
  hyperlink,
  onPress,
}) => {
  return (
    <View style={[stylesItemChat.container, isSent && HELPERS.mainEnd]}>
      <View style={stylesItemChat.avatarView}>
        {avatar && <Image style={stylesItemChat.avatarImage} source={avatar} />}
      </View>
      <View style={{marginBottom: small}}>
        {name && <Text style={stylesItemChat.textName}>{name}</Text>}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!onPress}
          onPress={onPress}
          style={[
            stylesItemChat.itemChat,
            isSent ? stylesItemChat.itemChatSent : stylesItemChat.itemChatReceived,
          ]}>
          <Text
            style={[
              stylesItemChat.textChat,
              isSent ? stylesItemChat.textChatSent : stylesItemChat.textChatReceived,
            ]}>
            {message}
            {!!hyperlink && <Text style={stylesItemChat.hyperlink}> {hyperlink}</Text>}
            {message2}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const PageOne = ({data, onSelectSercvice, defaultData}) => {
  return (
    <View key={1} style={styles.pageContainer}>
      <View>
        <Text style={styles.pageOneTitle}>{data?.title}</Text>
        <View style={styles.pageLogo}>
          <View style={styles.pageTwoImage}>
            <Image source={data?.image} />
          </View>
          <Text style={styles.textDescription}>{data?.description}</Text>
        </View>
      </View>
      <View style={styles.line} />
      <ChatItem avatar={defaultData?.botIcon} name={defaultData?.botName} />
      <ChatItem isSent={true} avatar={false} message={defaultData?.userChatOne} />
      <View style={styles.viewServices}>
        {data?.chatData?.map(item => (
          <TouchableOpacity
            key={item.servicesName}
            onPress={() => onSelectSercvice(item)}
            style={styles.itemServices}>
            <Text style={{...FONTS.regular, color: COLORS.TEXT_DARK_10}}>{item?.servicesName}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export const PageTwo = ({onPressBack, onPressAccept, servicesSelected, defaultData}) => {
  const {callPhone} = useContactInfo(HOTLINE_NUMBER);
  return (
    <>
      <View key={2} style={styles.pageTwoContainer}>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={onPressBack} style={styles.backView}>
            <Image source={IMAGES.ARROW_LEFT_LINEAR} />
          </TouchableOpacity>
          <Text style={styles.titlePageTwo}>
            {`${translate('common.hotline')} `}
            <Text style={{color: COLORS.PRIMARY_B100}}>{HOTLINE_NUMBER_FORMAT}</Text>
          </Text>
        </View>
        <ChatItem avatar={defaultData?.botIcon} name={defaultData?.botName} />
        <ChatItem isSent={true} avatar={false} message={servicesSelected?.reply?.messagesUser} />
        <ChatItem
          avatar={defaultData?.botIcon}
          message={defaultData?.botChatTwo}
          name={defaultData?.botName}
        />
        <ChatItem
          message={servicesSelected?.reply?.messagesBot}
          hyperlink={servicesSelected?.reply?.hyperlink}
          onPress={() => onPressAccept(servicesSelected)}
        />
        <ChatItem
          message={defaultData.botChatFour1}
          hyperlink={defaultData.botChatFourHyperLink}
          message2={defaultData.botChatFour2}
          onPress={callPhone}
        />
      </View>
    </>
  );
};

const Page = ({index, onPressAccept, onPressCancel, plusServicesDefault}) => {
  const pageOne = pageData.introData[index];
  const defaultData = pageData.chatDefault;
  const scrollRef = useRef(null);
  const [servicesSelected, setServicesSelected] = useState('');

  const dataPageOne = useMemo(() => {
    const chatData = pageOne.chatData.filter(item => {
      let serviceActive = true;
      if (item.type === TypeChatData.plusService) {
        serviceActive = plusServicesDefault.find(
          service => service.requestTypeId === item.requestTypeId && service.isDisplayHomepage,
        );
      }
      return serviceActive;
    });
    return {...pageOne, chatData};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const onSelectSercvice = item => {
    setServicesSelected(item);
    scrollRef?.current?.scrollTo({x: SCREEN_SIZE.WIDTH, animated: true});
  };

  return (
    <ScrollView ref={scrollRef} scrollEnabled={false} horizontal pagingEnabled>
      <PageOne
        data={dataPageOne}
        onSelectSercvice={item => onSelectSercvice(item)}
        defaultData={defaultData}
      />
      <PageTwo
        onPressCancel={onPressCancel}
        onPressAccept={onPressAccept}
        defaultData={defaultData}
        servicesSelected={servicesSelected}
        onPressBack={() => scrollRef?.current?.scrollTo({x: -SCREEN_SIZE.WIDTH, animated: true})}
      />
    </ScrollView>
  );
};

const IntroItem = ({item, onPressItem}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={commonStyles.shadowApp}
      onPress={() => onPressItem(item.id)}>
      <Image style={styles.imageIntro} resizeMode={'contain'} source={item.image} />
    </TouchableOpacity>
  );
};

const ViewSlider = ({views, onPress}) => {
  const {setCurrentIndex, carouselRef, onPressItem} = useSliderIntro({onPress: onPress});
  return (
    <>
      <Carousel
        loop
        ref={carouselRef}
        onSnapToItem={setCurrentIndex}
        data={views}
        renderItem={({item}) => <IntroItem item={item} onPressItem={onPressItem} />}
        width={SCREEN_SIZE.WIDTH}
        height={ITEM_HEIGHT}
        mode="parallax"
        modeConfig={{
          parallaxScrollingOffset: SCREEN_SIZE.WIDTH / 4,
          parallaxScrollingScale: 0.9,
          parallaxAdjacentItemScale: 0.8,
        }}
      />
    </>
  );
};

const ServiceIntro = ({onPress}) => {
  return <ViewSlider views={slides} onPress={id => onPress(id)} />;
};

const Intro = ({navigation, plusServicesDefault}) => {
  const {onPressCancel, modalIntro, pageIndex, onPressAccept, onPressPage} = useIntro({
    navigation: navigation,
  });
  return (
    <View style={styles.wrapperSection}>
      <Text style={[styles.sectionText, {marginLeft: normal}]}>{translate('home.introTitle')}</Text>
      <Text style={styles.txtSubTitle}>{translate('home.subIntroTitle')}</Text>
      <ServiceIntro onPress={index => onPressPage(index)} />
      <Portal>
        <ModalWithModalize getModalRef={modalIntro}>
          <Page
            navigation={navigation}
            onPressCancel={onPressCancel}
            onPressAccept={item => onPressAccept(item)}
            index={pageIndex}
            plusServicesDefault={plusServicesDefault}
          />
        </ModalWithModalize>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  imageIntro: {width: SCREEN_SIZE.WIDTH - 42, marginLeft: 24, height: ITEM_HEIGHT},
  sectionText: {...FONTS.semiBold, marginTop: normal, color: COLORS.TEXT_DARK_10, fontSize: 24},
  titlePageTwo: {
    alignSelf: 'center',
    textAlign: 'center',
    flex: 1,
    marginEnd: 40,
    fontSize: 24,
    ...FONTS.bold,
  },
  backView: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {flexDirection: 'row', marginBottom: 32},
  pageTwoContainer: {
    width: SCREEN_SIZE.WIDTH,
    borderRadius: SIZES.BORDER_RADIUS_10,
    padding: 16,
  },
  itemServices: {
    paddingVertical: tiny,
    marginEnd: small,
    marginBottom: small,
    paddingHorizontal: 6,
    flexWrap: 'wrap',
    borderRadius: SIZES.BORDER_RADIUS_50,
    backgroundColor: COLORS.NEUTRAL_DISABLE,
  },
  viewServices: {flexDirection: 'row', flexWrap: 'wrap', marginTop: normal},
  line: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.NEUTRAL_BORDER,
    marginVertical: normal,
  },
  pageTwoImage: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY_A10,
  },
  pageContainer: {
    padding: 24,
    width: SCREEN_SIZE.WIDTH,
    borderRadius: SIZES.BORDER_RADIUS_10,
  },
  pageOneTitle: {...FONTS.bold, fontSize: 24},
  pageLogo: {flexDirection: 'row', marginTop: 32},
  textDescription: {...FONTS.regular, marginLeft: normal, flex: 1},
  txtSubTitle: {
    ...FONTS.regular,
    lineHeight: 22,
    color: COLORS.TEXT_DARK_40,
    marginHorizontal: normal,
    marginTop: small,
    fontSize: 16,
  },
  wrapperSection: {
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    paddingTop: 12,
    marginTop: -5,
    marginBottom: small,
  },
});

const stylesItemChat = StyleSheet.create({
  itemChat: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  itemChatSent: {
    backgroundColor: COLORS.PRIMARY_A100,
    borderTopRightRadius: 0,
  },
  itemChatReceived: {backgroundColor: COLORS.NEUTRAL_DISABLE, borderTopLeftRadius: 0},
  textChat: {maxWidth: 250, lineHeight: 20},
  hyperlink: {color: COLORS.HYPERLINK_HYPERLINK},
  textChatSent: {color: COLORS.NEUTRAL_WHITE},
  textChatReceived: {color: COLORS.TEXT_DARK_10},
  textName: {color: COLORS.TEXT_DARK_40, fontSize: 12, marginBottom: 4},
  avatarView: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: small,
  },
  avatarImage: {width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2},
  container: {
    flexDirection: 'row',
    width: '100%',
  },
});

export default Intro;
