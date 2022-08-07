import React, { ReactElement, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors } from '@/vars';
import { language } from '@/i18n';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import CustomButton from '@/components/CustomButton';
import CreatePhotoItem from '@/screens/PublicProfile/CreatePhoto/component/CreatePhotoItem';
import ErrorMessage from '@/components/ErrorMessage';
import { CreatePhotoContext } from './CreatePhotoContext';
import { saveProfile } from '@/redux/createProfile/actions';
import NavigationActionsService from '@/navigation/navigation';
import { CREATE_PROFILE_PICTURE_SCREEN } from '@/navigation/screenKeys';

export function CreatePhotoScreen(): ReactElement {
  const [isError, setIsError] = useState(false);
  const listImage = useRef([]);

  const onContinue = () => {
    if (listImage.current.length === 0) {
      setIsError(true);
      return;
    }

    const imagesReverse = listImage.current.slice().reverse();
    const imagesSelected = imagesReverse.slice(0, 3);
    const imagesSubmit = imagesSelected.map(item => {
      return {
        type: item.mime,
        uri: item ? item.path : '',
        name: Math.random().toString() + '.jpg',
      };
    });

    NavigationActionsService.dispatchAction(
      saveProfile({
        photos: imagesSubmit,
      }),
    );
    NavigationActionsService.push(CREATE_PROFILE_PICTURE_SCREEN, { photos: imagesSubmit, isRegister: true });
  };

  const onAddImage = (image: any) => {
    if (isError) {
      setIsError(false);
    }
    listImage.current.push(image);
  };

  return (
    <CreatePhotoContext.Provider
      value={{
        onAddImage: onAddImage,
      }}
    >
      <View style={styles.container}>
        <SafeArea />
        <CustomWrapHeader title={language('addPhotos')} note={language('' + 'noteAddPhoto')} />
        <View style={styles.wrapError}>
          <ErrorMessage errorValue={isError ? language('noteAddPhotoError') : ''} />
        </View>
        <View style={styles.container}>
          <CreatePhotoItem />
          <CustomButton onPress={onContinue} containerStyle={styles.btnContinue} text={language('continue')} />
        </View>
      </View>
    </CreatePhotoContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  btnContinue: {
    paddingVertical: 13,
    marginTop: 40,
    margin: 20,
    alignSelf: 'center',
  },
  wrapError: {
    alignSelf: 'center',
  },
});
