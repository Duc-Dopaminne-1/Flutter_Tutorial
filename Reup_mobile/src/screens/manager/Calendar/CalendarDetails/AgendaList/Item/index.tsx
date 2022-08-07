import React, { useEffect, useState } from "react";
import { View, Image, Alert } from "react-native";
import styles from "../styles";
import { CustomText } from "@components/CustomText";
import { AVATAR_DEFAULT_RECTANGLE } from '@constants/icons';
import { CustomButton } from '@components/CustomButton';
import translate from '@src/localize';
import { useDispatch } from "react-redux";
import { EventStatus } from "@reup/reup-api-sdk/libs/api/enum";
import { changeStatusEvent } from "@src/modules/calendar/actions";
import { IEvent } from "@reup/reup-api-sdk/libs/api/calendar/event/models";
import { getFullName, getUserNameFromMail, isManagerApp } from "@src/utils";
import moment from "moment";
import { Theme } from "@src/components/Theme";

interface Props {
  item: IEvent;
  changeStatusEventCallback?: (idEvent: string, status: string) => void;
  changeStatusOnPress?: (loading: boolean) => void;
}

const AgendaListItem = (props: Props) => {
  const dispatch = useDispatch()
  const { item, changeStatusEventCallback, changeStatusOnPress } = props;
  const { id, date_from, date_to, facility, creator, status, title, description } = item;

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

  const onApprove = () => {
    onChangeStatusEvent(EventStatus.Accept);
  }

  const onReject = () => {
    onChangeStatusEvent(EventStatus.Reject);
  }

  const onChangeStatusEvent = (status: EventStatus) => {
    changeStatusOnPress && changeStatusOnPress(true);
    dispatch(
      changeStatusEvent({
        id,
        params: {
          status
        },
        onSuccess: data => {
          // TODO Reload data
          changeStatusOnPress && changeStatusOnPress(false);
          changeStatusEventCallback && changeStatusEventCallback(id, status);
        },
        onFail: error => {
          changeStatusOnPress && changeStatusOnPress(false);
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    )
  }

  const renderButtonChangeStatus = () => {
    if (status === EventStatus.Waiting) {
      return (
        <View style={styles.wrapButton} >
          <CustomButton
            style={styles.approve}
            text={translate('calendar.approve')}
            textStyle={styles.textApprove}
            onPress={onApprove}
          />
          <CustomButton
            style={styles.reject}
            text={translate('calendar.reject')}
            textStyle={styles.textReject}
            onPress={onReject}
          />
        </View>
      )
    } else {
      return null;
    }
  }

  const renderContent = () => {
    let backgroundColorLine = status === EventStatus.Waiting ? { backgroundColor: Theme.calendar.lineGrayBackground } : { backgroundColor: Theme.calendar.whiteBackground };
    if (status !== EventStatus.Reject) {
      const background = getBackgroundByStatus(status);
      const textColor = getTextStyleByStatus(status);
      return (
        <View style={[styles.item, background]}>
          <View style={styles.wrapHeader} >
            <Image style={styles.avatar} source={avatar} resizeMode={'contain'} />
            <CustomText
              numberOfLines={1}
              style={[styles.name, textColor]}
              text={nameCreator}
              styleContainer={styles.styleContainerFormTo}
            />
          </View>

          <View style={[styles.line, backgroundColorLine]} />

          <View style={[styles.textContainer, { alignItems: "center" }]}>
            <CustomText
              numberOfLines={2}
              style={[styles.content, textColor]}
              text={title}
              styleContainer={styles.styleContainerFormTo}
            />
          </View>

          <View style={[styles.textContainer, { alignItems: "center" }]}>
            <CustomText
              numberOfLines={5}
              style={[styles.firstTextStyle, textColor, styles.nameText]}
              styleContainer={styles.styleContainerFormTo}
              text={description}
            />
          </View>
          <View style={styles.textContainer}>
            <CustomText
              numberOfLines={1}
              style={[styles.secondTextStyle, textColor]}
              text={`${from} ${toText}`}
              styleContainer={styles.styleContainerFormTo}
            />
            <CustomText
              numberOfLines={1}
              style={[styles.firstTextStyle, styles.secondRightText, textColor]}
              text={facility.name}
              styleContainer={styles.styleContainerFormTo}
            />
          </View>

          {isManagerApp() && renderButtonChangeStatus()}
        </View>
      )
    } else {
      return null;
    }
  }

  return renderContent();
};

export default AgendaListItem;
