import { ViewStyle, TextStyle, View } from "react-native";
import React from "react";
import { CustomText } from "../../CustomText";
import styles from "./styles";
import { ExpenseState } from "@reup/reup-api-sdk/libs/api/enum";
import translate from "@src/localize";

interface Props {
  status: string;
  containerStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

const CustomStatusBill = (props: Props) => {

  const { status, containerStyle, textStyle } = props;

  const getContainerStyle = () => {
    switch (status) {
      case ExpenseState.Paid:
        return styles.containerPaid;
      case ExpenseState.Pending:
        return styles.containerPending;
      case ExpenseState.Draft:
      default:
        return styles.containerDraft;
    }
  };

  const getStatusStyle = () => {
    switch (status) {
      case ExpenseState.Paid:
        return styles.paid;
      case ExpenseState.Pending:
        return styles.pending;
      case ExpenseState.Draft:
      default:
        return styles.draft;
    }
  };

  const getStatus = () => {
    switch (status) {
      case ExpenseState.Paid:
        return translate('monthly_bill.paid');
      case ExpenseState.Pending:
        return translate('monthly_bill.pending');
      case ExpenseState.Draft:
      default:
        return translate('monthly_bill.draft');
    }
  };

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      <CustomText text={getStatus()} style={[getStatusStyle(), textStyle]} />
    </View>
  );
};

export default CustomStatusBill;
