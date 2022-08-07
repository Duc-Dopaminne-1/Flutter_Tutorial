import React, { FC, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { Subject } from 'rxjs';
import { colors, fonts, screenWidth } from '@/vars';
import { STATUSBAR_HEIGHT } from '@/components/SafeArea';
import TickSVG from '@/components/SVG/TickSVG';

interface AlertBannerProps {
  message: string;
  subject: Subject<any>;
}

const AlertBanner: FC<AlertBannerProps> = ({ message, subject }) => {
  const [shouldShowBanner, setShouldShowBanner] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 1,
      duration: 200,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 0,
      duration: 200,
    }).start();
    setTimeout(() => {
      setShouldShowBanner(false);
    }, 200);
  };

  useEffect(() => {
    const subscriber = subject.subscribe(_data => {
      setShouldShowBanner(true);
      fadeIn();
      setTimeout(() => {
        fadeOut();
      }, 4000);
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [subject]);

  if (!shouldShowBanner) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <TickSVG />
      <Text style={styles.textNote}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blue_50,
    paddingLeft: 12,
    width: screenWidth - 30,
    top: STATUSBAR_HEIGHT + 20,
    zIndex: 9999,
    borderRadius: 12,
    borderColor: colors.blue_200,
    paddingVertical: 20,
    borderWidth: 0.5,
    marginLeft: 15,
    shadowColor: colors.blue_bg,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 3,
  },
  textNote: {
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
    marginLeft: 10,
  },
});

export default AlertBanner;
