import React, { FC, useCallback } from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import { SafeArea } from '@/components/SafeArea';
import { language } from '@/i18n';
import { colors, screenWidth } from '@/vars';
import { useNavigation, useRoute } from '@react-navigation/core';
import { CREATE_CITY_SCREEN, CROP_PROFILE_PICTURE_SCREEN } from '@/navigation/screenKeys';
import { useDispatch } from 'react-redux';
import { saveProfile } from '@/redux/createProfile/actions';
import NavigationActionsService from '@/navigation/navigation';

const CreateProfilePicture: FC = () => {
  const navigation = useNavigation();
  const route: any = useRoute();
  const dispatch = useDispatch();

  const { photos, isRegister } = route.params;

  const handleUploadProfilePicture = useCallback(
    (item, uri) => {
      navigation.goBack();
      if (isRegister) {
        const profilePicture = {
          type: 'image/jpeg',
          uri,
          name: Math.random().toString() + '.jpg',
        } as any;
        dispatch(
          saveProfile({
            photos: [item, ...photos.filter(i => i.name !== item.name)],
            avatar: profilePicture,
          }),
        );
        NavigationActionsService.push(CREATE_CITY_SCREEN);
      }
    },
    [isRegister, photos],
  );

  const handleSelectPicture = useCallback(item => {
    navigation.navigate(CROP_PROFILE_PICTURE_SCREEN, { imageUri: item.uri, callback: uri => handleUploadProfilePicture(item, uri) });
  }, []);

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomWrapHeader title={language('chooseProfilePictureTitle')} note={language('chooseProfilePictureDescription')} />
      <View style={styles.container}>
        <View style={styles.photosWrapper}>
          <View style={styles.photosContainer}>
            {photos
              .slice()
              .reverse()
              .map(item => (
                <Pressable onPress={() => handleSelectPicture(item)}>
                  <Image source={{ uri: item.uri }} resizeMode={'cover'} style={styles.wrapButton} />
                </Pressable>
              ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  photosWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: screenWidth * 0.7 + 15 * 4,
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
});

export default CreateProfilePicture;
