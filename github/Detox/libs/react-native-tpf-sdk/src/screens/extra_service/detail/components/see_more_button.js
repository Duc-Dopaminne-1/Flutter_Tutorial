import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale } from '../../../../utils/responsive';
import { ICDown } from '../../../../assets/icons';
import AppText from '../../../../components/app_text';
import themeContext from '../../../../constants/theme/themeContext';
const SeeMoreButton = props => {
  const { onPress } = props;
  const theme = useContext(themeContext);
  return (
    <View style={styles.seeMoreContainer}>
      <View style={styles.gradientContainer} />
      <View style={styles.seeMoreWrapper}>
        <TouchableOpacity onPress={onPress} style={styles.seeMoreBtn}>
          <AppText style={{ color: theme.app.primaryColor1 }}>{'Xem Thêm'}</AppText>
          <ICDown fill={theme.app.primaryColor1} width={scale(12)} height={scale(7)} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default SeeMoreButton;
const styles = StyleSheet.create({
  gradientContainer: {
    height: scale(40),
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  seeMoreContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  seeMoreWrapper: {
    alignItems: 'center',
    paddingVertical: scale(10),
    width: '100%',
    backgroundColor: '#FFF'
  },
  seeMoreBtn: { flexDirection: 'row', alignItems: 'center' }
});
