import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, ImageBackground } from 'react-native';
import { colors, fonts, images } from '@/vars';
import { CustomText } from '@/components/CustomText';
import { language } from '@/i18n';
import { TouchDiscovery, touchDiscovery } from '@/shared/global';
import { TimeChangeDiscovery } from '@/screens/Home/component/HomeCarousel';
import LinearGradient from 'react-native-linear-gradient';
import HourGlassSVG from '@/components/SVG/HourGlassSVG';
import RedHeartSVG from '@/components/SVG/RedHeartSVG';
import MeetOfflineSVG from '@/components/SVG/MeetOfflineSVG';
import MeetOnlineSVG from '@/components/SVG/MeetOnlineSVG';

interface Prop {
  image: any;
  like: number;
  validateTime: boolean;
  isMeetOffline?: boolean;
  timeMeet?: string;
}

const TypeAction = {
  NONE: 'none',
  CLOSE: 'left',
  LIKE: 'right',
};

function HomeCarouseItemImage(props: Prop) {
  const [isImageError, setIsImageError] = useState(false);
  const { image, like = '', validateTime, isMeetOffline, timeMeet } = props;
  const [typeAction, setTypeAction] = useState('none');
  const textMeet = isMeetOffline ? language('meetPerson') : language('virtual');
  const iconMeet = isMeetOffline ? <MeetOfflineSVG /> : <MeetOnlineSVG />;

  useEffect(() => {
    const touchSubscribe = touchDiscovery.subscribe(data => {
      if (data.type === TouchDiscovery.Close) {
        setTypeAction(TypeAction.CLOSE);
      } else if (data.type === TouchDiscovery.Like) {
        setTypeAction(TypeAction.LIKE);
      }
      setTimeout(() => {
        setTypeAction(TypeAction.NONE);
      }, TimeChangeDiscovery);
    });

    return () => {
      touchSubscribe && touchSubscribe.unsubscribe();
    };
  }, []);

  const onLoadImageError = () => {
    setIsImageError(true);
  };

  const renderNope = () => {
    return (
      <View style={styles.wrapText}>
        <Image source={images.thumbDownPng} style={styles.thumbUpIcon} />
      </View>
    );
  };

  const renderLike = () => {
    return (
      <View style={styles.wrapText}>
        <Image source={images.thumbUpPng} style={styles.thumbUpIcon} />
      </View>
    );
  };

  const overlayLabels = {
    left: {
      element: renderNope(),
      style: {
        wrapper: styles.wrapperNope,
      },
    },
    right: {
      element: renderLike(),
      style: {
        wrapper: styles.wrapperLike,
      },
    },
    none: {
      element: null,
      title: '',
      style: {
        wrapper: {},
        wrapText: {},
      },
    },
  };

  const renderTypeMeet = () => {
    if (isMeetOffline === null) {
      return null;
    }
    return (
      <View style={styles.wrapMeet}>
        {iconMeet}
        <Text style={styles.textMeet}>{textMeet}</Text>
      </View>
    );
  };

  if (isImageError) {
    return <Image source={images.missing} style={styles.image} />;
  } else {
    return (
      <ImageBackground source={{ uri: image }} style={styles.image} onError={onLoadImageError}>
        {validateTime && (
          <LinearGradient
            locations={[0, 0.62, 0.83, 1]}
            colors={['rgba(249, 66, 58, 0)', 'rgba(249, 66, 58, 0)', 'rgba(249, 66, 58, 0.14)', 'rgba(249, 66, 58, 0.8)']}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        {renderTypeMeet()}
        <View style={styles.wrapIcon}>
          <View style={styles.wrapItem}>
            {validateTime ? (
              <View>
                <CustomText containerStyle={styles.wrapAuction} titleStyle={styles.textAuction} title={language('liveAuction')} />
                <CustomText
                  containerStyle={styles.wrapDuration}
                  titleStyle={styles.textDuration}
                  icon={<HourGlassSVG />}
                  imageStyle={styles.iconDuration}
                  title={timeMeet}
                />
              </View>
            ) : (
              <CustomText containerStyle={styles.wrapLike} titleStyle={styles.textLove} title={like.toString()} icon={<RedHeartSVG />} />
            )}
          </View>
        </View>
        <View style={[styles.wrapType, overlayLabels[typeAction].style.wrapper]}>
          <View style={overlayLabels[typeAction].style.wrapText}>
            {overlayLabels[typeAction].element && overlayLabels[typeAction].element}
          </View>
        </View>
      </ImageBackground>
    );
  }
}

export default React.memo(HomeCarouseItemImage);

const styles = StyleSheet.create({
  wrapItem: {
    flexDirection: 'row',
  },
  wrapMeet: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.bg_gray_virtual,
    marginTop: 10,
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  textMeet: {
    fontSize: fonts.size.s12,
    color: colors.red_700,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: '500',
  },
  image: {
    flex: 1,
    borderRadius: 12,
    width: '100%',
  },
  wrapType: {
    position: 'absolute',
    zIndex: 2,
    flex: 1,
    width: '100%',
    height: '100%',
  },
  wrapLike: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  wrapAuction: {
    alignItems: 'center',
    backgroundColor: colors.red_700,
    marginLeft: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  textAuction: {
    color: colors.white,
    fontSize: fonts.size.s12,
  },
  textLove: {
    marginLeft: 5,
    color: colors.gray_500,
    fontSize: fonts.size.s12,
  },
  wrapIcon: {
    flex: 1,
    paddingVertical: 8,
    justifyContent: 'flex-end',
    paddingLeft: 8,
  },
  wrapText: {
    backgroundColor: colors.white,
    borderRadius: 30,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.blue_700,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  wrapperNope: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: 18,
    marginLeft: -10,
  },
  wrapperLike: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 14,
    marginLeft: 15,
  },
  textDuration: {
    color: colors.white,
    fontSize: fonts.size.s12,
    height: 14,
    lineHeight: 16,
  },
  wrapDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 2,
  },
  iconDuration: {
    marginHorizontal: 6,
  },
  thumbUpIcon: {
    width: 36,
    height: 36,
  },
});
