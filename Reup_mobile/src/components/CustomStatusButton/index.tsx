import { BulletinPostStatus } from "@reup/reup-api-sdk/libs/api/enum";
import { ViewStyle, View, TextStyle } from "react-native";
import styles from "./styles";
import React from "react";
import { CustomText } from "../CustomText";

interface Props {
  status: string;
  containerStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

const CustomStatusButton = (props: Props) => {
  const { status = BulletinPostStatus.Approved, containerStyle, textStyle } = props;

  const getContainerStyle = () => {
    switch (status) {
      case BulletinPostStatus.Approved:
        return styles.containerApproved;
      case BulletinPostStatus.Denied:
        return styles.containerDenied;
      case BulletinPostStatus.Pending:
      default:
        return styles.containerPending;
    }
  };

  const getStatusStyle = () => {
    switch (status) {
      case BulletinPostStatus.Approved:
        return styles.approved;
      case BulletinPostStatus.Denied:
        return styles.denied;
      case BulletinPostStatus.Pending:
      default:
        return styles.pending;
    }
  };

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      <CustomText text={status} style={[getStatusStyle(), textStyle]} />
    </View>
  );
};

export default CustomStatusButton;
