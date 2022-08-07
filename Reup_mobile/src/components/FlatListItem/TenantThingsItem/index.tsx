import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import styles from './styles';
import { CustomText } from '@src/components/CustomText';
import { CHECKBOX_UNSELECT, CHECKBOX_SQUARE } from '@src/constants/icons';
import RoleType from '@src/screens/manager/Tenant/enum';
import { IUnitPet } from '@reup/reup-api-sdk/libs/api/unit/pet/models';
import { IUnitVehicle } from '@reup/reup-api-sdk/libs/api/unit/vehicle/models';

type Props = {
  role: RoleType;
  selectedIds: string[];
  item: any;
  onPress: (item: any) => void;
};

const TenantThingsItem = (props: Props) => {
  const { role, item, selectedIds, onPress } = props;
  const isSelected = selectedIds.some(id => item.id === id);
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <CustomText text={item.name} style={[styles.widthText, styles.name]} numberOfLines={1} />
      <CustomText text={item.description} style={[styles.widthText, styles.description]} numberOfLines={1} />
      {role === RoleType.management ? null : (
        <TouchableOpacity onPress={() => onPress(item)} style={styles.checkBoxView}>
          <Image source={isSelected ? CHECKBOX_SQUARE : CHECKBOX_UNSELECT} style={styles.checkBox} />
        </TouchableOpacity>
      )}
    </View>
  );
};

type PropsVehicle = {
  role: RoleType;
  selectedIds: string[];
  item: IUnitVehicle;
  onPress: (item: any) => void;
}

const VehicleItem = (props: PropsVehicle) => {
  const { role, item, selectedIds, onPress } = props;
  const isSelected = selectedIds.some(id => item.id === id);
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.img_url }} style={styles.image} />
      <CustomText text={item.model} style={[styles.widthText, styles.name]} numberOfLines={1} />
      <CustomText text={item.licence_plate} style={[styles.widthText, styles.description]} numberOfLines={1} />
      {role === RoleType.management ? null : (
        <TouchableOpacity onPress={() => onPress(item)} style={styles.checkBoxView}>
          <Image source={isSelected ? CHECKBOX_SQUARE : CHECKBOX_UNSELECT} style={styles.checkBox} />
        </TouchableOpacity>
      )}
    </View>
  );
};

type PropsPet = {
  role: RoleType;
  selectedIds: string[];
  item: IUnitPet;
  onPress: (item: any) => void;
}

const PetItem = (props: PropsPet) => {
  const { role, item, selectedIds, onPress } = props;
  const isSelected = selectedIds.some(id => item.id === id);
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.img_url }} style={styles.image} />
      <CustomText text={item.name} style={[styles.widthText, styles.name]} numberOfLines={1} />
      <CustomText text={item.type} style={[styles.widthText, styles.description]} numberOfLines={1} />
      {role === RoleType.management ? null : (
        <TouchableOpacity onPress={() => onPress(item)} style={styles.checkBoxView}>
          <Image source={isSelected ? CHECKBOX_SQUARE : CHECKBOX_UNSELECT} style={styles.checkBox} />
        </TouchableOpacity>
      )}
    </View>
  );
};
export { TenantThingsItem, PetItem, VehicleItem };
