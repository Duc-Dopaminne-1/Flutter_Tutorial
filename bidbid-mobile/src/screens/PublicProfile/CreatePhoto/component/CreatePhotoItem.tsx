import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, screenWidth } from '@/vars';
import CreatePhotoItemButton from '@/screens/PublicProfile/CreatePhoto/component/CreatePhotoItemButton';

function CreatePhotoItem() {
  return (
    <View style={styles.container}>
      <View style={styles.wrapBodyRow}>
        <CreatePhotoItemButton index={0} style={styles.wrapButton} />
        <CreatePhotoItemButton index={1} style={styles.wrapButton} />
      </View>

      <View style={styles.wrapBodyRow}>
        <CreatePhotoItemButton index={2} style={styles.wrapButton} />
        <View style={styles.btnRightBottom} />
      </View>
    </View>
  );
}

export default React.memo(CreatePhotoItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  wrapBodyRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  wrapButton: {
    height: screenWidth * 0.35,
    width: screenWidth * 0.35,
    borderRadius: 14,
    borderStyle: 'dashed',
    borderWidth: 0.8,
    borderColor: colors.gray_400,
    backgroundColor: colors.gray_50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
  },
  btnRightBottom: {
    height: screenWidth * 0.35,
    width: screenWidth * 0.35,
    backgroundColor: colors.white,
    margin: 15,
  },
});
