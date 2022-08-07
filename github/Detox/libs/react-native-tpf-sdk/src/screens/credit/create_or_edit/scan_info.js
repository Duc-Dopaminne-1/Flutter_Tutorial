import { useNavigation } from '@react-navigation/native';
import { getDepositMoneyHandler } from '../../../redux/actions/deposit';
import { scanIdCardHandle } from '../../../redux/actions/fileStorage';
import { getShowAlertError } from '../../../redux/actions/system';
import { ICError, ICImagePicker, ICSuccessChecked } from '../../../assets/icons';
import {
  BodyText,
  CustomInput,
  FloatFooter,
  RadioBoxes,
  SecondaryButton,
  SubHead
} from '../../../components/';
import AppText from '../../../components/app_text';
import PrimaryButton from '../../../components/primary_button';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { SCAN_ID_CARD_ERROR } from '../../../constants/errors';
import SCREENS_NAME from '../../../constants/screens';
import { BORDER_RADIUS, DEVICE_WIDTH, SPACING } from '../../../constants/size';
import React, { useCallback, useMemo, useState, useContext } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import SafeAreaView from 'react-native-safe-area-view';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';

const type = [
  {
    value: 0,
    title: 'product_screen.me'
  },
  {
    value: 1,
    title: 'product_screen.other'
  }
];

const ImageItem = ({ item, onPress, scanned, theme }) => {
  return (
    <TouchableOpacity
      style={styles.imageWrapper}
      onPress={() => onPress(item.index)}
      disabled={scanned}>
      <View style={styles.imageContainer}>
        {item?.url ? (
          <FastImage source={{ uri: item.url }} style={styles.image} />
        ) : (
          <ICImagePicker color1={theme?.app?.primaryColor1} />
          // <FastImage source={ic_upload} style={styles.image} resizeMode="contain" />
        )}
        {item?.scanned ? (
          <>
            <View style={styles.resultContainerBackgroud} />
            <View style={styles.resultContainer}>
              {item?.scanError ? (
                <>
                  <ICError />
                  <SubHead
                    translate
                    color={TEXT_COLOR.White}
                    bold={false}
                    style={{ marginLeft: scale(6) }}>
                    {'common.invalid'}
                  </SubHead>
                </>
              ) : (
                <>
                  <ICSuccessChecked color1={theme?.icon?.color1} />
                  <SubHead
                    translate
                    color={TEXT_COLOR.White}
                    bold={false}
                    style={{ marginLeft: scale(6) }}>
                    {'common.success'}
                  </SubHead>
                </>
              )}
            </View>
          </>
        ) : null}
      </View>
      <SubHead translate>{item.name}</SubHead>
    </TouchableOpacity>
  );
};

const CreateCreditApplication = props => {
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const productFilter = useSelector(state => state.credit.productFilter);
  const [dataForm, setDataForm] = useState(productFilter);

  const { addImageFromPicker, photoAdded } = props.route.params || {};
  const [form, setForm] = useState(props.route?.params?.form);
  const [productInfo, setProductInfo] = useState(props.route?.params?.productInfo);
  const { leadId, contactId } = useSelector(state => state.credit.orderMemo);
  const profileName = useSelector(state => state.member?.topenIdProfile?.name);

  const [idType, setIdType] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [idCardInfo, setIdCardInfo] = useState({});
  const [isScanError, setIsScanError] = useState(false);

  const [images, setImages] = useState([
    { index: 0, name: 'product_screen.front_view', code: 'frontIdCardImage' },
    { index: 1, name: 'product_screen.rear_view', code: 'backIdCardImage' }
    // {
    //   index: 2,
    //   name: 'product_screen.take_a_portrait_photo',
    //   code: 'avatarImage'
    // }
  ]);
  const [imageIndex, setImageIndex] = useState(0);

  const uploadImage = useCallback(
    index => {
      setImageIndex(index);
      navigation.navigate(SCREENS_NAME.CAMERA_CREATE_QUESTION, {
        base64: false,
        screenName: SCREENS_NAME.SCAN_INFO_CREDIT_SCREEN,
        multiple: false
      });
    },
    [navigation]
  );

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const _addImageFromPicker = addImageFromPicker || [];
      const _addImageFromSnap = photoAdded || {};
      if (_addImageFromSnap.sourceURL || _addImageFromSnap.path) {
        setIdCardInfo(null);
        setImages(pre => {
          pre[imageIndex].url =
            Platform.OS === 'ios' ? _addImageFromSnap.sourceURL : _addImageFromSnap.path;
          pre[imageIndex].filename = _addImageFromSnap.filename;
          pre[imageIndex].type = 'image/jpeg';
          pre[imageIndex].size = 0;
          pre[imageIndex].scanned = false;
          return [...pre];
        });
      }

      if (_addImageFromPicker.length > 0) {
        let image = _addImageFromPicker[0];
        setIdCardInfo(null);
        setImages(pre => {
          pre[imageIndex].url = Platform.OS === 'ios' ? image.sourceURL : image.path;
          pre[imageIndex].filename = image.filename;
          pre[imageIndex].type = image.mime;
          pre[imageIndex].size = image.size;
          pre[imageIndex].scanned = false;
          pre[imageIndex].scanError = false;
          return [...pre];
        });
      }

      navigation.setParams({ addImageFromPicker: null, photoAdded: null });
    });

    return unsubscribe;
  }, [addImageFromPicker, photoAdded, navigation, imageIndex]);

  // const uploadImage = useCallback(index => {
  //   ImagePicker.openPicker({
  //     width: 400,
  //     height: 300,
  //     multiple: false
  //   })
  //     .then(res => {
  //       setIdCardInfo(null);
  //       setImages(pre => {
  //         pre[index].url = Platform.OS === 'ios' ? res.sourceURL : res.path;
  //         pre[index].filename = res.filename;
  //         pre[index].type = res.mime;
  //         pre[index].size = res.size;
  //         pre[index].scanned = false;
  //         return [...pre];
  //       });
  //     })
  //     .catch(e => {});
  // }, []);

  const onContinue = useCallback(() => {
    dispatch(getDepositMoneyHandler());
    navigation.navigate(SCREENS_NAME.CREATE_CREDIT_STEP_1_SCREEN, {
      form: {
        ...form,
        ordersItem: {
          ...form.ordersItem,
          loanAmount: dataForm.loan
        }
      },
      productInfo,
      idCardInfo,
      leadId,
      contactId,
      isMyDeal: idType === 0 ? true : false
    });
  }, [idType, dispatch, form, productInfo, navigation, idCardInfo, leadId, contactId, dataForm]);

  const onCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onScanningCompleted = useCallback(
    res => {
      if (!res.isError) {
        if (
          res.result?.checkFrontImageSuccess &&
          res.result?.checkBackImageSuccess
          // res.result?.checkAvartarImageSuccess
        ) {
          setIsScanError(false);
          setIdCardInfo(res.result);
        } else {
          setIsScanError(true);
          setIdCardInfo(res.result);
        }

        let imageResult = [res.result?.checkFrontImageSuccess, res.result?.checkBackImageSuccess];
        setImages(pre =>
          pre.map(i => {
            return {
              ...i,
              scanned: true,
              scanError: !imageResult[i.index]
            };
          })
        );
      } else {
        dispatch(getShowAlertError({ ...SCAN_ID_CARD_ERROR, cancelAction: onCancel }));
        setIsScanError(true);
        setImages(pre =>
          pre.map(i => {
            return { ...i, scanError: true };
          })
        );
      }
      setScanning(false);
    },
    [dispatch, onCancel]
  );

  const scanIdentityCard = useCallback(() => {
    setScanning(true);
    dispatch(
      scanIdCardHandle({
        images,
        onCompleted: res => onScanningCompleted(res)
      })
    );
  }, [dispatch, images, onScanningCompleted]);

  const canScanning = useCallback(() => {
    return !images.find(t => !t.url) || images.find(t => !t.scanned);
  }, [images]);

  const numberOfNotImportedImages = useMemo(() => {
    return images.filter(t => !t.scanned && t.url)?.length;
  }, [images]);

  const onChangeValue = obj => {
    setDataForm({ ...dataForm, ...obj });
  };

  return (
    <SafeAreaView style={styles.container} forceInset={{ bottom: 'never' }}>
      <ScrollView
        style={styles.wrapper}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <AppText translate semiBold style={[styles.textTitle, { color: theme.text.primary }]}>
          {'create_question.you_want_to_borrow'}
        </AppText>
        <RadioBoxes
          translate
          checked={idType}
          data={type}
          onChange={setIdType}
          boxStyle={styles.idBoxes}
        />
        <BodyText translate semiBold style={styles.textTitle}>
          {'create_question.application_info'}
        </BodyText>

        <CustomInput
          style={styles.input}
          translate
          translateTitle
          type={'number'}
          title={'loan_package.loan_money_or_limit_card'}
          placeholder={'loan_package.load_placeholder'}
          value={dataForm.loan}
          required={true}
          onChangeText={value => {
            onChangeValue({ loan: value });
          }}
        />

        <BodyText translate semiBold style={styles.textTitle}>
          {'create_question.info'}
        </BodyText>
        <AppText translate style={[styles.textDescription, { color: theme?.text?.secondary }]}>
          {'create_question.tutorial'}
        </AppText>
        <View style={styles.list}>
          {images.map(e => {
            return <ImageItem key={e.name} item={e} onPress={uploadImage} theme={theme} />;
          })}
        </View>
      </ScrollView>
      <FloatFooter style={{ backgroundColor: BACKGROUND_COLOR.Primary }}>
        {scanning ? (
          <View style={{ marginBottom: SPACING.Medium }}>
            <ActivityIndicator />
          </View>
        ) : null}
        {numberOfNotImportedImages === 0 && !isScanError ? (
          <>
            <PrimaryButton
              translate
              title={'common.continue'}
              onPress={onContinue}
              disabled={!dataForm.loan || !idCardInfo || scanning}
            />
          </>
        ) : isScanError ? (
          <>
            <View style={styles.skipContainter}>
              <SecondaryButton
                translate
                title={'common.rescan_id'}
                onPress={scanIdentityCard}
                style={{ flex: 1, marginRight: SPACING.Medium }}
                disabled={scanning}
              />
              <PrimaryButton
                translate
                title={'common.continue'}
                onPress={onContinue}
                disabled={!dataForm.loan || !idCardInfo || scanning}
                style={{ flex: 1 }}
              />
            </View>
          </>
        ) : (
          <PrimaryButton
            disabled={numberOfNotImportedImages < 2 || scanning}
            translate
            title={'common.scan_id'}
            onPress={scanIdentityCard}
          />
        )}
      </FloatFooter>
    </SafeAreaView>
  );
};

export default CreateCreditApplication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  wrapper: {},
  contentContainer: {
    paddingHorizontal: SPACING.Medium,
    paddingBottom: SPACING.HasBottomButton
  },
  textTitle: {
    marginTop: SPACING.Large
  },
  idBoxes: {
    marginTop: scale(14),
    marginRight: SPACING.Large
  },
  textDescription: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    marginTop: SPACING.Normal
  },
  imageContainer: {
    width: (DEVICE_WIDTH - 3 * SPACING.Medium) / 2,
    height: scale(120),
    borderRadius: BORDER_RADIUS,
    marginBottom: SPACING.Normal,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: (DEVICE_WIDTH - 3 * SPACING.Medium) / 2,
    height: scale(120),
    borderRadius: BORDER_RADIUS,
    tintColor: 'red'
  },
  list: {
    marginTop: SPACING.XXNormal,
    marginRight: -SPACING.Medium,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  icImage: {
    marginTop: scale(16),
    marginLeft: scale(15)
  },
  close: {
    zIndex: 5,
    top: scale(18),
    right: scale(20),
    width: scale(16.25),
    height: scale(16.25),
    position: 'absolute'
  },
  imageWrapper: {
    alignItems: 'center',
    marginRight: SPACING.Medium,
    marginTop: SPACING.Large
  },
  skipContainter: {
    flexDirection: 'row'
  },
  resultContainer: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultContainerBackgroud: {
    position: 'absolute',
    width: '100%',
    height: scale(120),
    backgroundColor: BACKGROUND_COLOR.Black,
    opacity: 0.6,
    borderRadius: BORDER_RADIUS
  }
});
