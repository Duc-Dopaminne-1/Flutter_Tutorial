import * as React from 'react'
import {
  Alert,
  Animated,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import {
  colors,
  deviceHeight,
  deviceWidth,
  fonts,
  images,
  metrics
} from '@/vars'
import { useEffect } from 'react'
import { getUserInfo, postSendFCM } from '@/shared/ListAPI'
import { useState } from 'react'
import { UserFlatList } from '@/screens/Admin/Notification/component/UserFlatlist'
import { AdminHeader } from '@/screens/Admin/component/AdminHeader'
import Modal from 'react-native-modal'
import { ButtonImageBackground } from '@/components/ButtonImageBackground'
import { object, string } from 'yup'
import { Formik } from 'formik'
import CustomInput from '@/components/CustomInput'
import ErrorMessage from '@/components/ErrorMessage'
import { userInfo } from '@/shared/UserInfo'

type Props = {
  navigation?: any
  route?: object
}

const initialValues = {
  title: '',
  content: ''
}

const validationSchema = object().shape({
  content: string()
    .trim()
    .required('Field is Empty !'),
  title: string()
    .trim()
    .required('Field is Empty !')
})

let listIdUser = []
export function NotificationScreen(Props: Props) {
  const { navigation } = Props

  const [listData, setListData] = useState([])
  const [isModalVisible, setModalVisible] = useState(false)

  const getUser = async () => {
    const result = await getUserInfo()

    if (result) {
      console.log('**** get User', result.data)
      setListData(result.data)
    } else {
      Alert.alert('Oop!', 'Some thing went wrong!')
    }
  }

  useEffect(() => {
    ;(async function getListQuestion() {
      await getUser()
    })()
  }, [])

  const openModal = data => {
    listIdUser = data
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const onSubmit = async (values: any) => {
    let user = []
    if (userInfo.getSendAll()) {
      user = listData.filter(item => item.fcmID.token)
    } else {
      user = listData.filter(
        item => listIdUser.indexOf(item._id) !== -1 && item.fcmID.token
      )
    }

    const tokens = user.map(token => {
      return {
        token: token.fcmID.token
      }
    })

    console.log('**** tokens', tokens)

    await postSendFCM({
      token: tokens,
      title: values.title,
      content: values.content
    })

    setModalVisible(false)
    setTimeout(() => {
      alert(`Send Notification to ${user.length} Users`)
    }, 500)
  }

  const renderInputTitle = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps
    return (
      <>
        <CustomInput
          // componentContainer={{ }}
          containerStyle={{ marginTop: 10, width: deviceWidth - 70 }}
          description={'Title'}
          onChangeText={(text: string) => {
            setValues({ ...values, title: text })
          }}
          titleStyle={{ color: 'black' }}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          multiline={true}
          value={values.title}
          onBlur={handleBlur('title')}
          isShowRequired={true}
        />
        <ErrorMessage
          errorValue={touched.title && errors.title}
          style={styles.errorMessage}
        />
      </>
    )
  }

  const renderInputContent = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps
    return (
      <>
        <CustomInput
          description={'Question'}
          containerStyle={{ marginTop: 10, width: deviceWidth - 70 }}
          onChangeText={(text: string) => {
            setValues({ ...values, content: text })
          }}
          autoCapitalize="none"
          titleStyle={{ color: 'black' }}
          autoCorrect={false}
          returnKeyType="next"
          multiline={true}
          value={values.content}
          onBlur={handleBlur('content')}
          isShowRequired={true}
        />
        <ErrorMessage
          errorValue={touched.content && errors.content}
          style={styles.errorMessage}
        />
      </>
    )
  }

  return (
    <ImageBackground
      source={images.newBackground}
      resizeMode={'stretch'}
      style={styles.container}>
      <AdminHeader title={'Admin'} />
      <UserFlatList openModal={openModal} />

      <Modal
        key={'time'}
        isVisible={isModalVisible}
        hideModalContentWhileAnimating
        useNativeDriver
        style={{ justifyContent: 'center', alignItems: 'center' }}
        customBackdrop={
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.backgroundModal} />
          </TouchableWithoutFeedback>
        }>
        <View
          style={{
            height: deviceHeight / 2,
            width: deviceWidth - 40,
            paddingBottom: 10,
            backgroundColor: 'white',
            borderRadius: 12
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={[styles.productSelectedText]}>Send Notification</Text>

            <TouchableOpacity
              style={[
                styles.cancel,
                { position: 'absolute', top: -13, right: -35 }
              ]}
              onPress={closeModal}>
              <Image
                source={images.close}
                style={styles.cancelIcon}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            {formikProps => (
              <>
                <View style={styles.containerScrollView}>
                  {renderInputTitle(formikProps)}
                  {renderInputContent(formikProps)}
                  <ButtonImageBackground
                    onPress={formikProps.handleSubmit}
                    imageStyle={styles.buttonImage}
                    containerStyle={{ justifyContent: 'center', marginTop: 20 }}
                    text={'Send Notification'}
                    textStyle={{ fontSize: 18 }}
                    source={images.button_login_signup}
                  />
                </View>
              </>
            )}
          </Formik>
        </View>
      </Modal>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundModal: {
    flex: 1,
    backgroundColor: '#000000'
  },
  cancel: {
    width: metrics.footer_task_cancel_width,
    height: metrics.footer_task_cancel_height
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 20
  },
  cancelIcon: {
    width: 25,
    height: 25
  },
  buttonImage: {
    alignItems: 'center',
    paddingVertical: 8
  },
  productSelectedText: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: 17,
    fontWeight: '600',
    color: colors.black,
    marginTop: 10
  },
  errorMessage: {
    height: 20,
    width: '100%'
  },
  containerScrollView: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 8
  }
})
