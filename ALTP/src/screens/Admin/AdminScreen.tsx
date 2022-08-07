import * as React from 'react'
import {
  Alert,
  FlatList,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { colors, deviceWidth, fonts, images } from '@/vars'
import { AdminHeader } from '@/screens/Admin/component/AdminHeader'
import { AdminLevel } from '@/screens/Admin/component/AdminLevel'
import { useEffect } from 'react'
import {
  getQUestionFilter,
  getQuestionNormal,
  postCreateQuestion,
  postDeleteQuestion,
  postUpdateQuestion
} from '@/shared/ListAPI'
import { useState } from 'react'
import { AdminItem } from '@/screens/Admin/component/AdminItem'
import { ButtonImageBackground } from '@/components/ButtonImageBackground'
import Spinner from '@/components/Spinner'

type Props = {
  navigation?: any
  route?: object
}

export function AdminScreen(Props: Props) {
  const { navigation } = Props
  const [listData, setListData] = useState([])
  const [loading, setLoading] = useState(false)

  const getQuestion = async () => {
    const result = await getQUestionFilter({ level: 1 })
    if (result) {
      console.log('11111', result.data)
      setListData(result.data)
    } else {
      Alert.alert('Oop!', 'Some thing went wrong!')
    }
  }

  useEffect(() => {
    ;(async function getListQuestion() {
      await getQuestion()
    })()
  }, [])

  const renderItem = ({ item, index }) => {
    return <AdminItem item={item} onPressItem={onPressItem} />
  }

  const onPressItem = (data: any) => {
    console.log('**** Item', data)
    navigation.navigate('AdminCreateScreen', {
      onSubmitDeleteQuestion: onSubmitDeleteQuestion,
      onSubmitUpdateQuestion: onSubmitUpdateQuestion,
      isUpdate: true,
      item: data
    })
  }

  const onSubmitDeleteQuestion = async (values: any) => {
    console.log('**** Formik Delete', values)
    setLoading(true)
    const response = await postDeleteQuestion({
      id: values
    })

    setTimeout(() => {
      if (response) {
        console.log('**** Delete', values)
        setLoading(false)
        getQuestion()
      } else {
        setLoading(false)
        setTimeout(() => {
          Alert.alert('Oop!', 'Đăng Kí Không Thành Công')
        }, 500)
      }
    }, 500)
  }

  const onSubmitUpdateQuestion = async (values: any) => {
    console.log('**** Formik Updaete', values)
    setLoading(true)
    const response = await postUpdateQuestion({
      id: values.id,
      content: values.content,
      A: values.A,
      B: values.B,
      C: values.C,
      D: values.D,
      answer: values.answer,
      level: values.level
    })

    setTimeout(() => {
      if (response) {
        console.log('**** Createquestoin', values)
        setLoading(false)
        getQuestion()
      } else {
        setLoading(false)
        setTimeout(() => {
          Alert.alert('Oop!', 'Đăng Kí Không Thành Công')
        }, 500)
      }
    }, 500)
  }

  const onSubmitCreateQuestion = async (values: any) => {
    console.log('**** Formik', values)
    setLoading(true)
    const response = await postCreateQuestion({
      content: values.content,
      A: values.A,
      B: values.B,
      C: values.C,
      D: values.D,
      answer: values.answer,
      level: values.level
    })

    setTimeout(() => {
      if (response) {
        console.log('**** Createquestoin', values)
        setLoading(false)
        getQuestion()
      } else {
        setLoading(false)
        setTimeout(() => {
          Alert.alert('Oop!', 'Đăng Kí Không Thành Công')
        }, 500)
      }
    }, 500)
  }

  const onPressCreate = () => {
    navigation.navigate('AdminCreateScreen', {
      onSubmitCreateQuestion: onSubmitCreateQuestion
    })
  }

  const onPressLevel = async (level: number) => {
    const result = await getQUestionFilter({ level: level })
    if (result) {
      console.log('2222', result.data)
      setListData(result.data)
    } else {
      Alert.alert('Oop!', 'Some thing went wrong!')
    }
  }

  const onPressLogout = () => {
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
          onPress: () => {
            navigation.navigate('LoginScreen')
          }
        }
      ],
      {
        cancelable: false
      }
    )
  }
  return (
    <ImageBackground
      source={images.newBackground}
      resizeMode={'stretch'}
      style={styles.container}>
      <Spinner
        loading={loading}
        dimBackground={true}
        showText={true}
        text="Loading"
      />
      <AdminHeader onPressLogout={onPressLogout} title={'Admin'} />
      <AdminLevel onPressLevel={onPressLevel} />
      <FlatList<any>
        data={listData}
        style={{ flex: 1 }}
        renderItem={renderItem}
        keyExtractor={(_item, index) => {
          return _item._id
        }}
      />

      <ButtonImageBackground
        onPress={onPressCreate}
        imageStyle={{
          paddingVertical: 10,
          paddingHorizontal: 60
        }}
        containerStyle={{
          justifyContent: 'center',
          marginRight: -15,
          width: deviceWidth - 20,
          margin: 10
        }}
        text={'Tạo Câu Hỏi'}
        textStyle={{ fontSize: 18, marginLeft: -15 }}
        source={images.btnOrangeYelow}
      />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 20
  },
  text: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.family.SSPSemiBold,
    shadowColor: 'black',
    alignSelf: 'center',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowOffset: {
      width: 1,
      height: 2
    },
    elevation: 2
  }
})
