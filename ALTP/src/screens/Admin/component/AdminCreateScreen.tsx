import * as React from 'react'
import { Alert, ImageBackground, ScrollView, StyleSheet } from 'react-native'
import { colors, deviceWidth, fonts, images } from '@/vars'
import { AdminHeader } from '@/screens/Admin/component/AdminHeader'
import { ButtonImageBackground } from '@/components/ButtonImageBackground'
import { object, string } from 'yup'
import { Formik } from 'formik'
import CustomInput from '@/components/CustomInput'
import ErrorMessage from '@/components/ErrorMessage'
import { useRoute } from '@react-navigation/native'
type Props = {
  navigation?: any
  route?: object
  onSubmitCreateQuestion?: (data: any) => void
}

const validationSchema = object().shape({
  content: string()
    .trim()
    .required('Field is Empty !'),
  A: string()
    .trim()
    .required('Field is Empty !'),
  B: string()
    .trim()
    .required('Field is Empty !'),
  C: string()
    .trim()
    .required('Field is Empty !'),
  D: string()
    .trim()
    .required('Field is Empty !'),
  answer: string()
    .trim()
    .required('Field is Empty !'),
  level: string()
    .trim()
    .required('Field is Empty !')
})

export function AdminCreateScreen(Props: Props) {
  const { navigation } = Props
  const route = useRoute()
  const {
    onSubmitCreateQuestion,
    isUpdate,
    item,
    onSubmitUpdateQuestion,
    onSubmitDeleteQuestion
  } = route.params as any

  const initialValues = {
    content: item ? item.content : '',
    A: item ? item.A : '',
    B: item ? item.B : '',
    C: item ? item.C : '',
    D: item ? item.D : '',
    answer: item ? item.answer : '',
    level: item ? item.level : ''
  }

  const onSubmit = async (values: any) => {
    if (isUpdate) {
      const data = { ...values, ...{ id: item._id } }
      onSubmitUpdateQuestion && onSubmitUpdateQuestion(data)
    } else {
      onSubmitCreateQuestion && onSubmitCreateQuestion(values)
    }
    navigation.goBack()
  }

  const onSubmitDelete = () => {
    onSubmitDeleteQuestion && onSubmitDeleteQuestion(item._id)
    navigation.goBack()
  }

  const renderInputContent = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps
    return (
      <>
        <CustomInput
          componentContainer={styles.input}
          description={'Question'}
          onChangeText={(text: string) => {
            setValues({ ...values, content: text })
          }}
          autoCapitalize="none"
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

  const renderInputA = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps
    return (
      <>
        <CustomInput
          componentContainer={styles.input}
          description={'A : '}
          onChangeText={(text: string) => {
            setValues({ ...values, A: text })
          }}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          multiline={true}
          value={values.A}
          onBlur={handleBlur('A')}
          isShowRequired={true}
        />
        <ErrorMessage
          errorValue={touched.A && errors.A}
          style={styles.errorMessage}
        />
      </>
    )
  }

  const renderInputB = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps
    return (
      <>
        <CustomInput
          componentContainer={styles.input}
          description={'B : '}
          onChangeText={(text: string) => {
            setValues({ ...values, B: text })
          }}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          multiline={true}
          value={values.B}
          onBlur={handleBlur('B')}
          isShowRequired={true}
        />
        <ErrorMessage
          errorValue={touched.B && errors.B}
          style={styles.errorMessage}
        />
      </>
    )
  }

  const renderInputC = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps
    return (
      <>
        <CustomInput
          componentContainer={styles.input}
          description={'C : '}
          onChangeText={(text: string) => {
            setValues({ ...values, C: text })
          }}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          multiline={true}
          value={values.C}
          onBlur={handleBlur('C')}
          isShowRequired={true}
        />
        <ErrorMessage
          errorValue={touched.C && errors.C}
          style={styles.errorMessage}
        />
      </>
    )
  }

  const renderInputD = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps
    return (
      <>
        <CustomInput
          componentContainer={styles.input}
          description={'D : '}
          onChangeText={(text: string) => {
            setValues({ ...values, D: text })
          }}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          multiline={true}
          value={values.D}
          onBlur={handleBlur('D')}
          isShowRequired={true}
        />
        <ErrorMessage
          errorValue={touched.D && errors.D}
          style={styles.errorMessage}
        />
      </>
    )
  }

  const renderInputAnswear = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps
    return (
      <>
        <CustomInput
          componentContainer={styles.input}
          description={'Answer : '}
          onChangeText={(text: string) => {
            setValues({ ...values, answer: text })
          }}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          multiline={true}
          value={values.answer}
          onBlur={handleBlur('answer')}
          isShowRequired={true}
        />
        <ErrorMessage
          errorValue={touched.answer && errors.answer}
          style={styles.errorMessage}
        />
      </>
    )
  }

  const renderInputLevel = (formikProps: any) => {
    const { values, errors, setValues, touched, handleBlur } = formikProps
    return (
      <>
        <CustomInput
          componentContainer={styles.input}
          description={'Level : '}
          onChangeText={(text: string) => {
            setValues({ ...values, level: text })
          }}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          multiline={true}
          value={values.level}
          onBlur={handleBlur('level')}
          isShowRequired={true}
        />
        <ErrorMessage
          errorValue={touched.level && errors.level}
          style={styles.errorMessage}
        />
      </>
    )
  }

  const onBack = () => {
    navigation.goBack()
  }
  return (
    <ImageBackground
      source={images.newBackground}
      resizeMode={'stretch'}
      style={styles.container}>
      <AdminHeader
        onBack={onBack}
        isBack={true}
        title={isUpdate ? 'Cập Nhật Câu Hỏi' : 'Tạo Câu Hỏi'}
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
        {formikProps => (
          <>
            <ScrollView style={styles.containerScrollView}>
              {renderInputContent(formikProps)}
              {renderInputA(formikProps)}
              {renderInputB(formikProps)}
              {renderInputC(formikProps)}
              {renderInputD(formikProps)}
              {renderInputAnswear(formikProps)}
              {renderInputLevel(formikProps)}
            </ScrollView>
            {isUpdate ? (
              <ButtonImageBackground
                onPress={formikProps.handleSubmit}
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
                text={'Cập Nhật Câu Hỏi'}
                textStyle={{ fontSize: 18, marginLeft: -15 }}
                source={images.button_invite_friends}
              />
            ) : (
              <ButtonImageBackground
                onPress={formikProps.handleSubmit}
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
            )}
          </>
        )}
      </Formik>
      {isUpdate ? (
        <ButtonImageBackground
          onPress={onSubmitDelete}
          imageStyle={{
            paddingVertical: 10,
            paddingHorizontal: 60
          }}
          containerStyle={{
            justifyContent: 'center',
            marginRight: -15,
            width: deviceWidth - 20,
            margin: 10,
            marginTop: 0
          }}
          text={'Xóa Câu Hỏi'}
          textStyle={{ fontSize: 18, marginLeft: -15 }}
          source={images.btnOrangeYelow}
        />
      ) : null}
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  errorMessage: {
    height: 20,
    width: '100%'
  },
  input: {},
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
  },
  containerScrollView: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 8
  }
})
