import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/vars';
import { HomeDetailCarousel } from '@/screens/HomeDetail/component/HomeDetailCarousel';
import CustomHeader from '@/components/CustomHeader';
import { isIphoneX } from '@/shared/devices';
import { STATUSBAR_HEIGHT } from '@/components/SafeArea';
import IconBack from '@/components/SVG/BackSvg';

function HomeDetailParallaxImage() {
  const [iconBackColor, setIconBackColor] = useState(colors.red_700);
  return (
    <View>
      <View style={styles.wrapHeader}>
        <CustomHeader leftIcon={<IconBack />} containerStyle={styles.wrapIconBack} iconColor={iconBackColor} />
      </View>
      <HomeDetailCarousel
        onLoadEnd={() => {
          setIconBackColor(colors.white);
        }}
      />
    </View>
  );
}

export default React.memo(HomeDetailParallaxImage);

const styles = StyleSheet.create({
  wrapHeader: {
    position: 'absolute',
    top: isIphoneX() ? 10 : 0,
    zIndex: 2,
    height: 60,
    width: 60,
    marginTop: STATUSBAR_HEIGHT,
  },
  wrapIconBack: {
    width: 60,
    height: 60,
    backgroundColor: colors.transparent,
  },
});
