import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AppText from '../../../../components/app_text';
import { BodyText, CheckBox, CustomInput, RadioBoxes } from '../../../../components';
import { BORDER_RADIUS, SPACING } from '../../../../constants/size';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { TEXT_COLOR } from '../../../../constants/colors';
import { scale } from '../../../../utils/responsive';
import { ATTRIBUTE_TYPE } from '../../../../global/entity_type';
import SCREENS_NAME from '../../../../constants/screens';
import FastImage from 'react-native-fast-image';
import __ from 'lodash';
import { ICClose02, ICImagePicker } from '../../../../assets/icons';
import { apiGetAllTrigger } from '../../../../services/api/masterDataApi';
import { store } from '../../../../redux/store/configureStore';
import themeContext from '../../../../constants/theme/themeContext';
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

const FormInput = ({ data, onChange, navigation, route }) => {
  const [categories, setCategory] = useState([]);
  const theme = useContext(themeContext);

  const onFetchCategory = async () => {
    const rs = await apiGetAllTrigger({ TriggerType: 2, SkipCount: 0, MaxResultCount: 9999 });
    if (rs?.data?.success) {
      setCategory(rs.data.result.items);
    }
  };
  useEffect(() => {
    onFetchCategory();
  }, []);
  useEffect(() => {
    /*----- handle upload image -----*/
    if (!route?.params) {
      return;
    }

    const _addImageFromPicker = route.params.addImageFromPicker || [];
    const _addImageFromSnap = route.params.photoAdded || {};

    if (_addImageFromSnap.sourceURL || _addImageFromSnap.path) {
      const imageData = [...data.images, _addImageFromSnap];
      const newData = __.uniqBy(imageData, e => e.sourceURL || e.path);
      onChange({ images: newData });
    }
    if (_addImageFromPicker.length > 0) {
      const imageData = [...data.images, ..._addImageFromPicker];
      const newData = __.uniqBy(imageData, e => e.sourceURL || e.path);
      onChange({ images: newData });
    }
  }, [route]);
  const onChangeType = value => {
    if (value == 0) {
      const { name, phone, email } = store?.getState()?.member?.profile;
      onChange({ type: value, fullName: name, phone, email });
    } else {
      onChange({ type: value, fullName: '', phone: '', email: '' });
    }
  };

  // Set defaultChecked
  useEffect(() => {
    if (categories.length > 0) {
      const newCategories = categories.filter(elem => elem.isDefault);
      onChange({ categories: newCategories });
    }
  }, [categories]);

  const handleChange = key => value => {
    onChange({ [key]: value });
  };
  const handleSelectCategory = item => () => {
    if (data.categories.find(elem => elem.triggerCode === item.triggerCode)) {
      const newCategories = data.categories.filter(elem => elem.triggerCode != item.triggerCode);
      onChange({ categories: newCategories });
      return;
    }
    const newCategories = [...data.categories];
    newCategories.push(item);
    onChange({ categories: newCategories });
  };

  const handleChooseImage = () => {
    navigation.navigate(SCREENS_NAME.PHOTOS_COLLECTION, {
      base64: false,
      screenName: SCREENS_NAME.CREATE_REQUEST_SCREEN,
      multiple: true
    });
  };

  const handleRemoveImage = index => () => {
    const newImage = [...data.images];
    newImage.splice(index, 1);
    onChange({ images: newImage });
  };
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <AppText translate semiBold style={styles.textTitle}>
          {'create_question.want_to_request_support'}
        </AppText>
        <RadioBoxes
          translate
          checked={data.type}
          data={type}
          onChange={onChangeType}
          boxStyle={styles.idBoxes}
        />
        <CustomInput
          translate
          title={'profile.full_name'}
          placeholder={'create_request.input_full_name'}
          value={data.fullName}
          onChangeText={handleChange('fullName')}
          required
        />
        <CustomInput
          translate
          keyboardType="numeric"
          title={'profile.phone_number'}
          placeholder={'create_request.input_phone_number'}
          value={data.phone}
          onChangeText={handleChange('phone')}
          required
        />
        <CustomInput
          translate
          title={'create_support.email'}
          placeholder={'create_request.input_email'}
          value={data.email}
          onChangeText={handleChange('email')}
          required
        />
        <BodyText translate semiBold style={styles.textTitle}>
          {'create_request.category_request'}
        </BodyText>
        <View>
          {categories?.map(item => (
            <CheckBox
              key={item.triggerCode}
              style={{ marginTop: 15 }}
              translate
              label={item.triggerName}
              checked={data.categories.find(elem => elem.triggerCode == item.triggerCode)}
              onChange={handleSelectCategory(item)}
            />
          ))}
        </View>

        <CustomInput
          required
          translate
          hasExtend
          multiline
          maxLength={500}
          type={ATTRIBUTE_TYPE.textarea}
          title={'create_request.description'}
          placeholder={'create_question.enter_a_description'}
          value={data.description}
          onChangeText={handleChange('description')}
        />

        <AppText translate style={styles.imgTitle}>
          {'common.image'}
        </AppText>
        <View style={styles.imgSection}>
          {data.images.map((item, index) => (
            <View key={(item?.id || index).toString()}>
              <TouchableOpacity onPress={handleRemoveImage(index)} style={styles.close}>
                <ICClose02 />
              </TouchableOpacity>
              <FastImage source={{ uri: item?.sourceURL || item?.path }} style={styles.image} />
            </View>
          ))}
          <TouchableOpacity onPress={handleChooseImage} style={styles.addImage}>
            <ICImagePicker
              color1={theme?.app?.primaryColor1}
              height={scale(104, false)}
              width={scale(104)}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default FormInput;
const styles = StyleSheet.create({
  textTitle: {
    marginTop: SPACING.Large
  },
  idBoxes: {
    marginTop: scale(14),
    marginRight: SPACING.Large
  },
  image: {
    height: scale(104, false),
    width: scale(104),
    borderRadius: BORDER_RADIUS,
    marginRight: scale(12),
    marginTop: scale(5)
  },
  imgTitle: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SubHead,
    paddingBottom: SPACING.Normal
  },
  close: {
    zIndex: 5,
    top: scale(10),
    right: scale(18),
    width: scale(16.25),
    height: scale(16.25),
    position: 'absolute'
  },
  imgSection: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  addImage: {
    marginTop: scale(5)
  }
});
