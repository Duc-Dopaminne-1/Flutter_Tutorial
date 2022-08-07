import React, { useState } from "react";
import { View, Image } from "react-native";
import styles from "../styles";
import { CustomText } from "@components/CustomText";
import { AVATAR_DEFAULT_RECTANGLE } from '@constants/icons';
import { IEvent } from "@reup/reup-api-sdk/libs/api/calendar/event/models";
import { getFullName, getUserNameFromMail } from "@src/utils";
import moment from "moment";
import { EventStatus } from "@reup/reup-api-sdk/libs/api/enum";
import { Theme } from "@src/components/Theme";

interface Props {
  item: IEvent;
  changeStatusEventCallback?: () => void;
  changeStatusOnPress?: (loading: boolean) => void;
}

const AgendaListItemTenant = (props: Props) => {
  const { item: { id, date_from, date_to, facility, creator, status, title, description } } = props;

  let nameCreator = creator && getFullName(creator.first_name ?? '', creator.last_name ?? '');
  if (!creator.first_name && !creator.last_name) {
    nameCreator = creator && getUserNameFromMail(creator.email ?? '');
  }
  const from = moment(date_from).format('hh:mm A')
  const toText = date_to && `- ${moment(date_to).format('hh:mm A')}`;
  const avatar = creator && creator.avatar ? { uri: creator.avatar } : AVATAR_DEFAULT_RECTANGLE;

  function getBackgroundByStatus(status: string) {
    switch (status) {
      case EventStatus.Expired:
        return styles.veryLightPinkBackground;
      case EventStatus.Waiting:
        return styles.blueBackground;
      case EventStatus.Accept:
        return styles.greenBackground;
    }
  }

  function getTextStyleByStatus(status: string) {
    switch (status) {
      case EventStatus.Expired:
        return styles.blackText;
      case EventStatus.Reject:
      case EventStatus.Accept:
      case EventStatus.Waiting:
        return styles.whiteText;
    }
  }

  const background = getBackgroundByStatus(status);
  const textColor = getTextStyleByStatus(status);

  const renderContent = () => {
    let backgroundColorLine = status === EventStatus.Waiting ? { backgroundColor: Theme.calendar.lineGrayBackground } : { backgroundColor: Theme.calendar.whiteBackground };
    if (status !== EventStatus.Reject) {
      return (
        <View style={[styles.item, background]}>
          <View style={styles.wrapHeader} >
            <Image style={styles.avatar} source={avatar} resizeMode={'contain'} />
            <CustomText
              numberOfLines={1}
              style={[styles.name, textColor]}
              text={nameCreator}
            />
          </View>

          <View style={[styles.line, backgroundColorLine]} />

          <View style={[styles.textContainer, { alignItems: "center" }]}>
            <CustomText
              numberOfLines={2}
              style={[styles.content, textColor]}
              text={title}
            />
          </View>

          <View style={[styles.textContainer, { alignItems: "center" }]}>
            <CustomText
              numberOfLines={5}
              style={[styles.firstTextStyle, textColor, styles.nameText]}
              text={description}
            />
          </View>
          <View style={styles.textContainer}>
            <CustomText
              numberOfLines={1}
              style={[styles.secondTextStyle, textColor]}
              text={`${from} ${toText}`}
            />
            <CustomText
              numberOfLines={1}
              style={[styles.firstTextStyle, styles.secondRightText, textColor]}
              text={facility.name}
            />
          </View>
        </View>
      )
    } else {
      return null
    }
  }

  return renderContent();
};

export default AgendaListItemTenant;
