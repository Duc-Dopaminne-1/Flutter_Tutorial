import styles from "./styles";
import React from "react";
import { CustomText } from "@src/components/CustomText";
import { getApartmentName } from "@src/utils";
import { IC_APARTMENT } from "@src/constants/icons";
import CustomStatusBill from "@src/components/MonthlyBill/CustomStatusBill";
import { View } from "react-native";
import { IExpense } from "@reup/reup-api-sdk/libs/api/bulletin/expense/model";
import moment from "moment";

interface Props {
  item: IExpense,
}

const MonthlyBillHeader = (props: Props) => {

  const { item } = props;

  const time = item && item.month ? moment(item.month).format('MM/YYYY') : '';

  const unit = item && item.unit ? item.unit : undefined;
  const apartment = unit ? getApartmentName(unit.block, unit.floor, unit.code) : '';

  const status = item && item.state ? item.state : '';

  return (
    <View style={styles.container}>
      <CustomText
        text={apartment}
        style={styles.apartmentCode}
        styleContainer={styles.containerApartmentCode}
        numberOfLines={1}
        leftIcon={IC_APARTMENT}
      />
      <CustomText
        text={time}
        style={styles.time}
        styleContainer={styles.containerTime}
        numberOfLines={1}
      />
      <CustomStatusBill
        status={status}
        containerStyle={styles.containerStatus}
      />
    </View>
  );
};

export default React.memo(MonthlyBillHeader);
