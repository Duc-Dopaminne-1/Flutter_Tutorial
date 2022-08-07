import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/vars';
import BackgroundImage from './BackgroundImage';
import CustomHeader from '@/components/CustomHeader';
import { STATUSBAR_HEIGHT } from '@/components/SafeArea';
import { isIphoneX } from '@/shared/devices';
import IconBack from '@/components/SVG/BackSvg';

function HeaderView() {
  return (
    <>
      <View style={styles.wrapHeader}>
        <CustomHeader containerStyle={styles.wrapIconBack} leftIcon={<IconBack color={colors.white} />} iconColor={colors.white} />
      </View>
      <BackgroundImage />
    </>
  );
}

export default React.memo(HeaderView);

const styles = StyleSheet.create({
  wrapIconBack: {
    height: null,
    backgroundColor: colors.transparent,
  },
  wrapHeader: {
    position: 'absolute',
    top: isIphoneX() ? 10 : 0,
    zIndex: 2,
    height: 60,
    width: 60,
    marginTop: STATUSBAR_HEIGHT,
  },
});
