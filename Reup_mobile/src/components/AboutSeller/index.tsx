
import React from 'react';
import styles from './styles';
import { View, ViewStyle } from 'react-native';
import CustomSectionHeader from '../CustomSection';
import CircleAvatar from '../CircleAvatar';
import { CustomText } from '../CustomText';
import { CustomButton } from '../CustomButton';
import { IC_DIAL, CONTACT } from '@src/constants/icons';
import translate from '@src/localize';
import { isTenantApp } from '@src/utils';

export type SellerModel = {
  first_name: string,
  last_name: string,
  description: string,
  dob: string,
  idType: string,
  idNo: string,
  telephone: string,
  cellphone: string,
  email: string,
  address: string
  avatar: string,
}

interface AboutSellerProp {
  containerStyle?: ViewStyle,
  data: any,
  onPress: () => void;
}

const AboutSeller = (props: AboutSellerProp) => {

  const { data, onPress } = props;

  const renderAvatar = () => {
    return (
      <View style={styles.avatarContainer}>
        <CircleAvatar
          name={data.first_name}
          size={80}
          avatar={data.avatar}
          borderColor={"#F3F3F3"}
        />
        <View style={styles.avatarInfoContainer}>
          <CustomText text={data.first_name + " " + data.last_name} style={styles.avatarName} />
          <CustomButton onPress={onPress} text={translate("about_seller.contact_seller")} iconLeft={IC_DIAL} style={styles.dialButton} />
        </View>
      </View>
    );
  };

  const renderInfo = () => {
    const phoneDisplay = data.phone
      ? (data.phone_code ? data.phone_code : "") + data.phone
      : (data.phone1_code ? data.phone1_code : "") + data.phone1;
    return (
      <View style={styles.infoContainer}>
        <View style={styles.paramContainer}>
          <CustomText
            text={translate("about_seller.first_name")}
            style={styles.titleStyle}
          />
          <CustomText
            text={data.first_name}
            numberOfLines={2}
            style={styles.contentStyle}
            styleContainer={styles.contentContainer}
          />
        </View>
        <View style={styles.paramContainer}>
          <CustomText
            text={translate("about_seller.last_name")}
            style={styles.titleStyle}
          />
          <CustomText
            text={data.last_name}
            numberOfLines={2}
            style={styles.contentStyle}
            styleContainer={styles.contentContainer}
          />
        </View>
        <View style={styles.paramContainer}>
          <CustomText
            text={translate("member_detail.phone")}
            style={styles.titleStyle}
          />
          <CustomText
            text={phoneDisplay}
            numberOfLines={2}
            style={styles.contentStyle}
            styleContainer={styles.contentContainer}
          />
        </View>
        <View style={styles.paramContainer}>
          <CustomText
            text={translate("about_seller.email")}
            style={styles.titleStyle}
          />
          <CustomText
            text={data.email}
            numberOfLines={2}
            style={styles.contentStyle}
            styleContainer={styles.contentContainer}
          />
        </View>
      </View>
    );
  };


  return (
    <View style={[styles.container, props.containerStyle]}>
      {isTenantApp() ?
        <CustomSectionHeader
          title={translate("shopping_store.about_seller")}
          styleIcon={{ width: 0, height: 0 }}
        /> :
        <CustomSectionHeader
          title={translate("about_seller.title")}
          icon={CONTACT}
        />
      }

      {renderAvatar()}

      {renderInfo()}
    </View>
  );
};

export default React.memo(AboutSeller);
