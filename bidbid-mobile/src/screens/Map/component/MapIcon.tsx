import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import IconGGCafeSVG from '@/components/SVG/IconGGCafeSVG';

function MapIcon(): ReactElement {
  return (
    <View style={styles.wrapMarker}>
      <IconGGCafeSVG />
    </View>
  );
}

export default React.memo(MapIcon);

const styles = StyleSheet.create({
  wrapMarker: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
