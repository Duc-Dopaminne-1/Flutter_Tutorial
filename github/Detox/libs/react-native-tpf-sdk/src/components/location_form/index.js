import __, { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { View } from 'react-native';
import SwitchToggle from 'react-native-switch-toggle';
import { useSelector, useDispatch } from 'react-redux';
import { SubHead } from '..';
import AppText from '../../components/app_text';
import { BUTTON_COLOR, TEXT_COLOR } from '../../constants/colors';
import { LOCATION_DETAIL } from '../../global/entity_type';
import CustomInput from '../custom_input';
import styles from './styles';
import { useEffect } from 'react';
import { getMasterDataHandle } from '../../redux/actions/masterData';
import themeContext from '../../constants/theme/themeContext';

const LocationForm = ({
  title,
  style,
  province,
  district,
  ward,
  addressDetail,
  zipCode,
  onChangeValue,
  display,
  translateTitle = false,
  itemRef,
  isRequired = false,
  onEndEditing,
  hideTitle = false
}) => {
  const theme = useContext(themeContext);
  const region = useSelector(state => state.masterData.region);
  const provinces = __.filter(region, obj => !obj?.parentCode);
  const districts = __.filter(region, obj => obj?.parentCode == province && province);
  const wards = __.filter(region, obj => obj?.parentCode == district && district);
  const hasSwitch = itemRef?.addressData?.canCopyValue || false;
  const isChecked = itemRef?.addressData?.isChecked || false;
  const copyTitle = itemRef?.addressData?.referenceAddressName;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!region || isEmpty(region) || region?.length === 0) {
      dispatch(getMasterDataHandle());
    }
  }, [region, dispatch]);

  const onSwitch = () => {
    onChangeValue?.({
      ward,
      district,
      province,
      zipCode,
      addressDetail,
      isChecked: !isChecked
    });
  };

  const onChangeAddress = text => {
    onChangeValue?.({
      ward,
      district,
      province,
      zipCode,
      addressDetail: text
    });
  };
  const onChangeZipCode = text => {
    onChangeValue?.({
      ward,
      district,
      province,
      addressDetail,
      zipCode: text
    });
  };

  const chooseItem = (code, modalType) => {
    if (modalType === 0) {
      onChangeValue?.({
        addressDetail,
        zipCode,
        ward: '',
        district: '',
        province: code
      });
      return;
    }

    if (modalType === 1) {
      onChangeValue?.({
        addressDetail,
        zipCode,
        ward: '',
        province,
        district: code
      });
      return;
    }

    onChangeValue?.({
      addressDetail,
      zipCode,
      district,
      province,
      ward: code
    });
  };

  return (
    <View style={[styles.locationFormWrapper, style]}>
      {title && !hideTitle ? (
        <View style={styles.titleWrapper}>
          <AppText translate={translateTitle} semiBold style={styles.formTitle}>
            {title}
          </AppText>
        </View>
      ) : null}
      {hasSwitch ? (
        <View style={styles.switchRow}>
          <SubHead>{copyTitle}</SubHead>
          <SwitchToggle
            switchOn={isChecked}
            onPress={onSwitch}
            containerStyle={styles.containerStyle}
            circleStyle={styles.circleStyle}
            circleColorOff="#FFFFFF"
            circleColorOn="#FFFFFF"
            backgroundColorOn={theme.app.primaryColor1}
            backgroundColorOff="#CCD1D9"
          />
        </View>
      ) : null}
      {!hasSwitch || (hasSwitch && !isChecked) ? (
        <>
          {display.includes(LOCATION_DETAIL.Province) ? (
            <CustomInput
              hideTitle={hideTitle}
              translate
              translateTitle
              type="select"
              value={province}
              style={styles.input}
              title={'common.province'}
              selectOptions={provinces}
              onChangeText={value => chooseItem(value, 0)}
              placeholder={'common.province_placeholders'}
              required={isRequired}
            />
          ) : null}

          {display.includes(LOCATION_DETAIL.District) ? (
            <CustomInput
              hideTitle={hideTitle}
              translate
              translateTitle
              type="select"
              value={district}
              style={styles.input}
              title={'common.district'}
              selectOptions={districts}
              onChangeText={value => chooseItem(value, 1)}
              placeholder={'common.district_placeholders'}
              required={isRequired}
              onEndEditing={onEndEditing}
            />
          ) : null}
          {display.includes(LOCATION_DETAIL.Ward) ? (
            <CustomInput
              translate
              translateTitle
              type="select"
              value={ward}
              style={styles.input}
              title={'common.wards'}
              selectOptions={wards}
              onChangeText={value => chooseItem(value, 2)}
              placeholder={'common.wards_placeholders'}
              required={isRequired}
              onEndEditing={onEndEditing}
            />
          ) : null}
          {display.includes(LOCATION_DETAIL.AddressDetail) ? (
            <CustomInput
              translate
              translateTitle
              value={addressDetail}
              style={styles.input}
              onChangeText={onChangeAddress}
              placeholder={'common.address_detail_placeholders'}
              title={'common.address_detail'}
              required={isRequired}
              onEndEditing={onEndEditing}
              item={itemRef?.addressData?.addressDetail?.find(
                item => item?.code === LOCATION_DETAIL.AddressDetail
              )}
            />
          ) : null}
          {display.includes(LOCATION_DETAIL.ZipCode) ? (
            <CustomInput
              translate
              translateTitle
              value={zipCode}
              style={styles.input}
              onChangeText={onChangeZipCode}
              placeholder={'common.zip_code_placeholders'}
              title={'common.zip_code'}
              required={isRequired}
              onEndEditing={onEndEditing}
              item={itemRef?.addressData?.addressDetail?.find(
                item => item?.code === LOCATION_DETAIL.ZipCode
              )}
            />
          ) : null}
        </>
      ) : null}
    </View>
  );
};

LocationForm.propTypes = {
  title: PropTypes.string,
  addressDetail: PropTypes.string,
  zipCode: PropTypes.string,
  ward: PropTypes.string,
  district: PropTypes.string,
  province: PropTypes.string,
  display: PropTypes.array,
  onChangeValue: PropTypes.func
};

LocationForm.defaultProps = {
  province: '',
  style: {},
  display: [
    LOCATION_DETAIL.Province,
    LOCATION_DETAIL.District,
    LOCATION_DETAIL.Ward,
    LOCATION_DETAIL.AddressDetail
  ]
};

export default React.memo(LocationForm);
