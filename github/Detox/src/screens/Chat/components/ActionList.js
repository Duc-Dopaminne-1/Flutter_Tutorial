import React from 'react';
import {StyleSheet, View} from 'react-native';

import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {normal} from '../../../assets/theme/metric';
import ListItem from './ListItem';

export type ActionsListProps = {
  onPressFile: () => {},
  onPressCamera: () => {},
  onPressGallery: () => {},
};

const ActionList = ({onPressFile, onPressCamera, onPressGallery}: ActionsListProps) => {
  return (
    <View style={styles.container}>
      <ListItem
        icon={IMAGES.IC_DOCUMENT}
        title={translate('chat.menu.file')}
        onPress={onPressFile}
      />
      <ListItem
        icon={IMAGES.IC_CAMERA}
        title={translate('chat.menu.camera')}
        onPress={onPressCamera}
      />
      <ListItem
        icon={IMAGES.IC_IMAGE}
        title={translate('chat.menu.gallery')}
        onPress={onPressGallery}
      />
    </View>
  );
};

export default ActionList;

export const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: normal,
  },
});
