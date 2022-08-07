import * as React from 'react'
import {
  Alert,
  AsyncStorage,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import { images, metrics } from '@/vars'
import { ButtonImage } from '@/components/ButtonImage'
import { HomeBottomBarMoney } from '@/screens/Home/component/HomeBottomBarMoney'
import Modal from 'react-native-modal'
import ImagePicker from 'react-native-image-crop-picker'
import { useState } from 'react'
import { userInfo } from '@/shared/UserInfo'
import { postUploadAvatar } from '@/shared/ListAPI'
import { cacheUser } from '@/constants/roleUser'
import { useRef } from 'react'

export function HomeBottomBar(props: any) {
  const options = ['Take a photo', 'Select an image from library', 'Cancel']
  let ActionSheetRef = useRef<any>(null)
  const [avatar, setAvatar] = useState(userInfo.getUserInfo().avatar)
  const [isShowModal, setIsShowModal] = useState(false)
  function onPressCup() {
    props.navigation.navigate('RankScreen')
  }

  function onPressSetting() {
    Alert.alert(
      'Alert',
      'Are you sure?',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Yes',
          style: 'cancel',
          onPress: async () => {
            await AsyncStorage.removeItem(cacheUser.UserInfo)
            props.navigation.navigate('LoginScreen')
          }
        }
      ],
      {
        cancelable: false
      }
    )
  }

  function onPressProfile() {
    setIsShowModal(true)
  }

  async function uploadAvatar(photo) {
    console.log('**** avatar', photo)
    const data = new FormData()
    data.append('email', userInfo.getUserInfo().email)
    data.append('avatar', {
      name:
        Platform.OS === 'android'
          ? photo.modificationDate + '.JPG'
          : photo.filename,
      type: photo.mime,
      uri:
        Platform.OS === 'android'
          ? photo.path
          : photo.path.replace('file://', '')
    })
    await postUploadAvatar(data)
    //  closeModal()
  }

  const closeModal = () => {
    setIsShowModal(false)
  }

  const handleUploadMedia = () => {
    ActionSheetRef.show()
  }

  const handleActionSheet = index => {
    switch (index) {
      case 0: // take a new photo
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true
        }).then(image => {
          setAvatar(image.path)
          uploadAvatar(image)
        })
        break
      case 1: // select image from library
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
          mediaType: 'photo'
        }).then(image => {
          setAvatar(image.path)
          uploadAvatar(image)
        })
        break
      default:
        break
    }
  }

  return (
    <View style={styles.container}>
      <ButtonImage source={images.cup0} onPress={onPressCup} />
      <ButtonImage source={images.social} onPress={onPressProfile} />

      <ButtonImage source={images.setting} onPress={onPressSetting} />
      <HomeBottomBarMoney />

      <Modal
        key={'profile'}
        hideModalContentWhileAnimating
        useNativeDriver
        style={{ justifyContent: 'center', alignItems: 'center' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={closeModal}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#000000'
              }}
            />
          </TouchableWithoutFeedback>
        }
        isVisible={isShowModal}>
        <ImageBackground
          resizeMode={'stretch'}
          source={images.btnBlue2}
          style={styles.containerModal}>
          <View style={{ flexDirection: 'column' }}>
            <View style={styles.wrapTitle}>
              <Text style={styles.title}>TÀI KHOẢN</Text>
              <TouchableOpacity
                style={{ position: 'absolute', top: 0, right: -40 }}
                onPress={closeModal}>
                <Image source={images.close1} style={styles.close} />
              </TouchableOpacity>
            </View>

            <View style={styles.wrapAvatar}>
              <View style={styles.wrapCamera}>
                <TouchableOpacity
                  onPress={() => {
                    handleUploadMedia()
                    // ImagePicker.openPicker({
                    //     width: 300,
                    //     height: 400,
                    //     cropping: true
                    // }).then(image => {
                    //     setAvatar(image.path)
                    //     uploadAvatar(image)
                    //
                    // });
                  }}>
                  <Image source={images.camera} style={styles.camera} />
                </TouchableOpacity>
              </View>

              <View>
                <Image
                  source={{
                    uri: avatar
                      ? avatar
                      : 'https://cdn4.vectorstock.com/i/1000x1000/47/93/person-icon-iconic-design-vector-18314793.jpg'
                  }}
                  style={styles.avatar}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'column', marginTop: 20 }}>
              <Text style={{ color: 'black', fontSize: 18, fontWeight: '600' }}>
                Name: {userInfo.getUserInfo().name}
              </Text>
              <Text style={{ color: 'black', fontSize: 18, fontWeight: '600' }}>
                email: {userInfo.getUserInfo().email}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </Modal>
      <ActionSheet
        ref={ref => (ActionSheetRef = ref)}
        title={'Select what you want'}
        options={options}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={handleActionSheet}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 80,
    width: '100%',
    backgroundColor: '#0A0F3E',
    shadowColor: '#0A0F3E',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: -4
    },
    elevation: 2
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    color: 'black',
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 20
  },
  containerModal: {
    alignSelf: 'center',
    height: (metrics.screen_height / 5) * 2,
    width: (metrics.screen_width / 4) * 3,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  wrapTitle: {
    flexDirection: 'row',
    marginLeft: 15,
    marginTop: 10
  },
  close: {
    height: 30,
    width: 30,
    backgroundColor: 'black',
    tintColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  wrapAvatar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 12
  },
  wrapCamera: {
    backgroundColor: 'white',
    position: 'relative',
    right: 40,
    padding: 6,
    borderRadius: 12
  },
  camera: {
    height: 30,
    width: 30
  },
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
    marginLeft: -15
  }
})
