import { ICAddImageGrey, ICCloseGrey } from '../../../assets/icons';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/size';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { PrimaryButton, SubHead } from '../../../components/';
import __, { isEmpty } from 'lodash';
import { Shadow } from '../../../constants/stylesCSS';
import CreditLetter from './credit_letter';
import CustomTextInput from '../../../components/custom_text_input';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import { scale } from '../../../utils/responsive';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { useSelector } from 'react-redux';
import { MEMBER_TYPE } from '../../../global/member_type';
import { useDispatch } from 'react-redux';
import { createFAQSupportHandler } from '../../../redux/actions/faq';
import { getShowAlertError } from '../../../redux/actions/system';
import { CREATE_FAQ_SUPPORT_SUCCESSFULLY } from '../../../constants/success';
import { CALL_API_ERROR } from '../../../constants/errors';
import { WithLoading } from '../../../components/';
import { FAQ } from '../../../redux/actionsType';
import { CalculateTypeItems, TermItems } from '../../../global/loan';
import SCREENS_NAME from '../../../constants/screens';
import themeContext from '../../../constants/theme/themeContext';

const LoanSupport = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const role = useSelector(state => state.auth.role);
  const memberId = useSelector(state => state.auth.memberId);
  const profile = useSelector(state => state.member.topenIdProfile);
  const { name, email, phone } = profile || {};
  const { data: loanData } = route.params || {};
  const [form, setForm] = useState({ fullName: '', phone: '', content: '' });
  const [images, setImages] = useState([]);
  const [data, setData] = useState({});
  const { fonts, text } = useContext(themeContext) || {};
  React.useEffect(() => {
    if (loanData && !isEmpty(loanData)) {
      setData(loanData);
    }
  }, [loanData]);

  const { calculateType, paymentTerm } = data || {};

  const _paymentTerm = useMemo(() => {
    const result = TermItems.find(item => item?.code === paymentTerm);
    return result?.displayName || '';
  }, [paymentTerm]);
  const _calculateType = useMemo(() => {
    const result = CalculateTypeItems.find(item => item?.code === calculateType);
    return result?.displayName || '';
  }, [calculateType]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const _addImageFromPicker = route.params.addImageFromPicker || [];
      const _addImageFromSnap = route.params.photoAdded || {};

      if (_addImageFromSnap.sourceURL || _addImageFromSnap.path) {
        const imageData = [...images, _addImageFromSnap];
        const newData = __.uniqBy(imageData, e => e.sourceURL || e.path);
        setImages(newData);
      }

      if (_addImageFromPicker.length > 0) {
        const imageData = [...images, ..._addImageFromPicker];
        const newData = __.uniqBy(imageData, e => e.sourceURL || e.path);
        setImages(newData);
      }
    });

    return unsubscribe;
  }, [navigation, route, images]);

  const onAddImage = useCallback(() => {
    navigation.navigate(SCREENS_NAME.CAMERA_CREATE_QUESTION, {
      base64: true,
      screenName: SCREENS_NAME.LOAN_SUPPORT_SCREEN
    });
  }, [navigation]);

  const removeImage = useCallback(
    item => {
      const index = __.findIndex(images, o => o.filename === item?.filename);
      if (index > -1) {
        images.splice(index, 1);
        setImages([...images]);
      }
    },
    [images]
  );
  const onChangeValue = useCallback(field => value => setForm({ ...form, [field]: value }), [form]);
  const onSubmitRequest = useCallback(() => {
    const imageBase64 = images.map(item => {
      return { image: item?.data };
    });
    const contentExtra = {
      ...data,
      calculateType: _calculateType,
      paymentTerm: _paymentTerm
    };
    const params = {
      memberId: MEMBER_TYPE.Guest !== role ? memberId : null,
      content: form.content,
      fullName: MEMBER_TYPE.Guest !== role ? name : form.fullName,
      email: MEMBER_TYPE.Guest !== role ? email : '',
      phoneNumber: (MEMBER_TYPE.Guest !== role ? phone : form.phone) || '0912345678',
      requesterType: role || 'Guest',
      requestType: 'Finance',
      images: imageBase64,
      contentExtra: JSON.stringify(contentExtra)
    };
    dispatch(
      createFAQSupportHandler({
        params,
        callback: (err, res) => {
          if (!err) {
            dispatch(getShowAlertError(CREATE_FAQ_SUPPORT_SUCCESSFULLY));
            navigation.goBack();
          } else {
            dispatch(getShowAlertError(CALL_API_ERROR));
          }
        }
      })
    );
  }, [
    dispatch,
    email,
    phone,
    memberId,
    form,
    images,
    name,
    navigation,
    role,
    data,
    _calculateType,
    _paymentTerm
  ]);

  const styleDate = {
    ...styles.date,
    fontFamily: fonts?.REGULAR,
    color: text?.secondary
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
        <View style={[styles.payBackDetail, { paddingTop: 0 }]}>
          {MEMBER_TYPE.Guest === role && (
            <>
              <CustomTextInput
                translateTitle
                translatePlaceholder
                title={'profile.full_name'}
                onChangeText={onChangeValue('fullName')}
                placeholder={'profile.full_name'}
              />
              <CustomTextInput
                translateTitle
                translatePlaceholder
                keyboardType="numeric"
                title={'profile.phone_number'}
                onChangeText={onChangeValue('phone')}
                placeholder={'profile.phone_number'}
              />
            </>
          )}
          <CustomTextInput
            translateTitle
            translatePlaceholder
            styleTitle={styles.titleText}
            title={'common.content'}
            onChangeText={onChangeValue('content')}
            placeholder={'common.content'}
          />
          <SubHead translate style={styles.addImage}>
            {'loan_support.add_image'}
          </SubHead>
          {images?.map((image, index) => {
            return (
              <View key={index.toString()} style={styles.fileInfo}>
                <TouchableOpacity style={styles.close} onPress={() => removeImage(image)}>
                  <ICCloseGrey />
                </TouchableOpacity>

                <FastImage style={styles.image} source={{ uri: image?.sourceURL || image?.path }} />
                <View style={styles.imgInfo}>
                  <Text style={[styles.imgName, { fontFamily: fonts.SEMIBOLD }]} numberOfLines={1}>
                    {image?.filename}
                  </Text>
                  <View style={styles.bottomImgTextRow}>
                    <Text style={styleDate}>
                      {image?.size
                        ? parseFloat(image?.size / 1204000) < 1
                          ? `${parseFloat(image?.size / 1204).toFixed(1)}KB`
                          : `${parseFloat(image?.size / 1204000).toFixed(1)}MB`
                        : ''}
                    </Text>
                    <Text style={styleDate}>{moment(new Date()).format('DD/MM/YYYY')}</Text>
                  </View>
                </View>
              </View>
            );
          })}
          <TouchableOpacity onPress={onAddImage}>
            <ICAddImageGrey />
          </TouchableOpacity>
        </View>
        <CreditLetter data={data} isSupport />
      </ScrollView>
      <View style={styles.bottomBtn}>
        <PrimaryButton
          translate
          title={'support.send_require'}
          disabled={MEMBER_TYPE.Guest === role ? Object.values(form).includes('') : !form.content}
          onPress={onSubmitRequest}
        />
      </View>
    </View>
  );
};
export default WithLoading(React.memo(LoanSupport), [FAQ.CREATE_FAQ_SUPPORT.HANDLER]);
const styles = StyleSheet.create({
  close: {
    position: 'absolute',
    top: scale(-10),
    left: scale(40),
    zIndex: 999999
  },
  container: {
    backgroundColor: BACKGROUND_COLOR.Primary,
    flex: 1
  },
  wrapper: {
    paddingHorizontal: SPACING.Medium,
    paddingTop: SPACING.Medium,
    paddingBottom: SPACING.HtmlBottom
  },
  bottomBtn: {
    ...Shadow,
    backgroundColor: BACKGROUND_COLOR.Primary,
    padding: SPACING.Medium
  },
  needDetail: {
    color: TEXT_COLOR.GreenBold,
    marginTop: SPACING.Large,
    marginBottom: SPACING.Small
  },
  addImage: { paddingTop: SPACING.Medium, paddingBottom: SPACING.Normal },
  payBackDetail: {
    ...Shadow,
    backgroundColor: BACKGROUND_COLOR.Primary,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.Medium,
    marginBottom: SPACING.Medium
  },
  image: {
    height: scale(48, false),
    width: scale(48),
    borderRadius: scale(8)
  },
  fileInfo: {
    flexDirection: 'row',
    marginBottom: SPACING.Medium
  },
  imgInfo: {
    flex: 1,
    marginLeft: scale(12)
  },
  imgName: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    color: CUSTOM_COLOR.GreenBold
  },
  bottomImgTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between'
  },
  date: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginTop: SPACING.Small,
    alignSelf: 'flex-end'
  }
});
