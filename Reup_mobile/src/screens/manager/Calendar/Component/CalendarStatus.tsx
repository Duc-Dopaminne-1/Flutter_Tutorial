import React from "react";
import { View } from "react-native";
import styles from "../styles";
import translate from "@src/localize";
import { CustomText } from "@src/components/CustomText";

interface Props {

}

const CalendarStatus = (props: Props) => {
  return (
    <>
      <View style={styles.statusDetail}>
        <View style={styles.statusItemContainer}>
          <View style={[styles.circleView, styles.greenBackground]} />
          <CustomText
            style={styles.statusItemText}
            text={translate("calendar.text_approved")}
          />
        </View>

        <View style={styles.statusItemContainer}>
          <View style={[styles.circleView, styles.blueBackground]} />
          <CustomText
            style={styles.statusItemText}
            text={translate("calendar.text_pending")}
          />
        </View>

        <View style={styles.statusItemContainer}>
          <View style={[styles.circleView, styles.veryLightPinkBackground]} />
          <CustomText
            style={styles.statusItemText}
            text={translate("calendar.text_expired")}
          />
        </View>
      </View>
    </>
  );
};

export default CalendarStatus;
