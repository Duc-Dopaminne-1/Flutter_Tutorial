import React from 'react';
import { StyleSheet, View, Pressable, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import LinearGradient from 'react-native-linear-gradient';
import { CustomBidInfoTopTimer } from '@/components/CustomBidInfo/CustomBidInfoTopTimer';
import { capitalizeAllWorks } from '@/shared/processing';
import DefaultText from '@/components/CustomText/DefaultText';
import ClockSVG from '@/components/SVG/ClockSVG';
import { StatusProfile } from '@/constants/app';
import { vs } from '@/vars/scaling';
import IconNotVerifySVG from '@/components/SVG/IconNotVerifySVG';
import IconVerifiedSVG from '@/components/SVG/IconVerifiedSVG';
import IconVerifiedUserSVG from '@/components/SVG/IconVerifiedUserSVG';

export interface CustomNameIconProps {
  name: string;
  age: number | string;
  isFromDiscovery?: boolean;
  time?: string;
  onPressCountTime?: () => void;
  validateTime?: boolean;
  endTimeCB?: () => void;
  status: string;
  nameStyle?: StyleProp<TextStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  hideAge?: boolean;
}

function CustomNameIcon(props: CustomNameIconProps) {
  const {
    name = '',
    age = '',
    isFromDiscovery,
    time,
    onPressCountTime,
    validateTime,
    endTimeCB,
    status,
    nameStyle,
    wrapperStyle,
    containerStyle,
    hideAge,
  } = props;

  const renderAuction = () => {
    return (
      <Pressable onPress={onPressCountTime} style={styles.wrapAuction}>
        <View style={styles.wrapDot}>
          <View style={styles.dot} />
        </View>

        <LinearGradient
          start={{ x: 0.15, y: 0 }}
          end={{ x: 1.2, y: 0.5 }}
          locations={[0, 1]}
          style={styles.linear}
          colors={[colors.blue_light, colors.blue_gray]}
        />

        <LinearGradient
          start={{ x: 0.15, y: 0 }}
          end={{ x: 1.2, y: 0.5 }}
          locations={[0, 1]}
          style={styles.wrapTime}
          colors={[colors.blue_light, colors.blue_gray]}
        >
          <ClockSVG />
          <CustomBidInfoTopTimer onPressTime={onPressCountTime} endTimeCB={endTimeCB} infoTime={time} />
        </LinearGradient>
      </Pressable>
    );
  };

  const renderIconVerify = () => {
    if (status === StatusProfile.VERIFIED) return <IconVerifiedUserSVG />;
    return <IconNotVerifySVG />;
  };

  // capitalizeAllWorks
  return (
    <View style={[styles.wrapContent, wrapperStyle]}>
      <View style={[styles.nameContainer, containerStyle]}>
        {!hideAge && !!age ? (
          <View style={styles.wrapText}>
            <DefaultText {...{ style: [styles.name, nameStyle], numberOfLines: 1, ellipsizeMode: 'tail' }}>
              {capitalizeAllWorks(name)}
            </DefaultText>
            <DefaultText {...{ style: [styles.name, styles.age, nameStyle], ellipsizeMode: 'tail' }}>{`, ${age}`}</DefaultText>
            {renderIconVerify()}
          </View>
        ) : (
          <View style={styles.wrapText}>
            <DefaultText {...{ style: [styles.name, styles.nameExpand, nameStyle], numberOfLines: 1, ellipsizeMode: 'tail' }}>
              {capitalizeAllWorks(name)}
            </DefaultText>
            {renderIconVerify()}
          </View>
        )}
      </View>
      {isFromDiscovery && validateTime ? renderAuction() : null}
    </View>
  );
}

export default React.memo(CustomNameIcon);

const styles = StyleSheet.create({
  wrapContent: {
    paddingTop: vs(12),
  },
  wrapText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(15),
  },
  age: {
    minWidth: 52,
  },
  name: {
    flexShrink: 1,
    fontSize: vs(20),
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsSemiBold,
  },
  wrapAuction: {
    alignItems: 'flex-end',
    position: 'absolute',
    right: -24,
    top: -25,
  },
  wrapDot: {
    backgroundColor: colors.transparent,
    zIndex: 8,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: colors.blue_gray,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
    marginBottom: -5,
  },
  linear: {
    width: 8,
    height: 4.5,
    zIndex: 2,
    marginBottom: -1,
  },
  wrapTime: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  nameExpand: {
    marginRight: 10,
  },
});
