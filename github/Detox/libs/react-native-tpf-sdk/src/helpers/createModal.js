import AppText from '../components/app_text';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import RootSiblings from 'react-native-root-siblings';

const elememts = [];

export const createModal = children => {
  const modal = new RootSiblings(
    children ? (
      children
    ) : (
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute'
        }}>
        <TouchableOpacity
          onPress={closeModal}
          style={{
            height: 56,
            width: 100,
            backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <AppText translate>{'common.close'}</AppText>
        </TouchableOpacity>
      </View>
    )
  );

  elememts.push(modal);
};

export const closeModal = () => {
  const modal = elememts.pop();
  modal && modal.destroy();
};
