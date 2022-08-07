import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import styles from './styles';
import DropdownNative, { ObjDropdown } from '../Dropdown/DropdownNative';
import CircleAvatar from '@src/components/CircleAvatar';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { getFullName } from '@src/utils';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { CustomText } from '../CustomText';
import { updateProfile } from '@src/modules/auth/actions';
import translate from '@src/localize';
import { findIndex } from 'lodash';
import { IProperty } from '@reup/reup-api-sdk/src/api/company/property/model';

const SideHeaderTenant = () => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const propertyReducer = useSelector<RootState, IPagination<IProperty>>((state: RootState) => state.company.listMyProperty);
  const listProperty: ObjDropdown[] = propertyReducer && propertyReducer.results && propertyReducer.results.map((obj: IProperty) => {
    return { _key: obj.id, _value: obj.name };
  });
  const [properties, setProperties] = useState<number>(findIndex(listProperty, { _key: me && me.default_property ? me.default_property : '' }) ?? 0);

  useEffect(() => {
    if (me && me.default_property) {
      setProperties(findIndex(listProperty ? listProperty : [], { _key: me.default_property }) ?? 0);
    }
  }, [me, listProperty]);

  const getName = () => {
    if (me && me.first_name && me.last_name) {
      return getFullName(me.first_name, me.last_name);
    }
    return me && me.email;
  };

  const onSuccessUpdateProfile = (obj: ObjDropdown) => {
    setProperties(findIndex(listProperty, { _key: obj._key }));
  };

  const onChangeDropdown = (obj: ObjDropdown) => {
    dispatch(
      updateProfile({
        data: { default_property: obj._key },
        onSuccess: () => {
          onSuccessUpdateProfile(obj);
        },
        onFail: error => {
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        },
      }));
  };

  const renderBuilding = () => {
    if (listProperty.length > 1) {
      return (
        <DropdownNative
          arrData={listProperty}
          containerStyle={styles.headerPositionName}
          selected={properties}
          lineBottom={true}
          isShowAccessory={true}
          onChangeDropDown={onChangeDropdown}
          linearGradientColors={["transparent", "transparent"]}
          textStyle={styles.buildingText}
          iconRightStyle={styles.arrowImage}
          isHideTitle={true}
          textTitle={'Choose Property'}
        />
      );
    } else if (listProperty.length <= 1
      && me
      && me.default_property) {
      const defaultProperty = listProperty.find(item => item._key === me.default_property);
      const nameBuilding = defaultProperty ? defaultProperty._value : '';
      return (
        <CustomText text={nameBuilding} style={styles.buildingText} styleContainer={styles.headerPositionName} />
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.headerView}>
      <CircleAvatar
        name={getName()}
        size={66}
        avatar={me && me.avatar} />
      <View style={styles.headerName}>
        <Text style={styles.headerNameText}>Hi </Text>
        <Text style={styles.headerNameTextSpan}>{getName()}</Text>
      </View>
      {renderBuilding()}
    </View>
  );
};

export default React.memo(SideHeaderTenant);
