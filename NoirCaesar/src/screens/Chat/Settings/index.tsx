import React from "react";
import { CustomHeader } from "@src/components/CustomHeader";
import { BACK } from "@src/constants/icons";
import { FlatList } from "react-native";
import Container from "@src/components/Container";
import NavigationActionsService from "@src/navigation/navigation";
import GroupSettingItem from "@src/components/Chat/GroupSettingItem";
import translate from "@src/localize";
import styles from "./styles";
import { SELECT_USER_SCREEN } from "@src/constants/screenKeys";
import { IScreenType } from "../SelectUser";
import { useDispatch } from "react-redux";
import { leaveChannel } from "@src/modules/chat/channel/actions";

interface Props {
  channelId?: string;
  isFromChannel?: boolean;
}

interface SettingsItem {
  key: string;
  title: string;
}

const settingItems: SettingsItem[] = [
  { key: 'manage', title: translate('chat_component.manage_group_member') },
  { key: 'add', title: translate('chat_component.add_members') },
  { key: 'leave', title: translate('chat_component.leave_group_chat') }
]

const GroupSettings = (props: Props) => {
  const { channelId, isFromChannel } = props;
  const dispatch = useDispatch();

  const onPressBack = () => {
    NavigationActionsService.pop();
  }

  const backToChannelScreen = () => {
    NavigationActionsService.hideLoading();
    NavigationActionsService.popToChannelScreen();
  }

  const backToRootScreen = () => {
    NavigationActionsService.hideLoading();
    NavigationActionsService.popToRoot();
  }

  const handleLeaveGroup = () => {
    if (channelId) {
      NavigationActionsService.showLoading();
      dispatch(leaveChannel({
        channelId,
        onSuccess: backToChannelScreen,
        onFail: error => {
          if (error && error.code == 6005) {
            // User have been removed
            if (isFromChannel) backToChannelScreen();
            else backToRootScreen();
            return;
          }
          NavigationActionsService.hideLoading();
          NavigationActionsService.showErrorPopup(error);
        }
      }));
    }
  }

  const onItemPress = (key: string) => {
    switch (key) {
      case 'manage':
        NavigationActionsService.push(SELECT_USER_SCREEN, { screenType: IScreenType.MANAGE_USER, channelId }, true);
        break;
      case 'add':
        NavigationActionsService.push(SELECT_USER_SCREEN, { screenType: IScreenType.ADD_USER, channelId }, true);
        break;
      case 'leave':
        NavigationActionsService.showCustomPopup({
          showLogo: false,
          text: translate('chat_component.leave_group_warning'),
          buttonRedTitle: translate('global.yes'),
          buttonGrayTitle: translate('global.cancel'),
          onPressRedButton: () => {
            NavigationActionsService.hideCustomPopup();
            handleLeaveGroup();
          }
        });
        break;
    }
  }

  const renderHeader = () => {
    return (
      <CustomHeader
        leftImage={BACK}
        title={translate('chat_component.group_settings_title')}
        leftAction={onPressBack}
      />
    );
  };

  const renderSettingItem = ({ item, index }: { item: SettingsItem, index: number }) => {
    const { key, title } = item;
    return (
      <GroupSettingItem
        lineBottom key={key}
        title={title}
        onPressItem={onItemPress.bind(undefined, key)}
      />
    );
  }

  const renderListSettings = () => {
    return (
      <FlatList
        style={styles.listContainer}
        data={settingItems}
        renderItem={renderSettingItem}
        keyExtractor={item => item.key}
      />
    )
  }

  return (
    <Container>
      {renderHeader()}
      {renderListSettings()}
    </Container>
  );
};

export default GroupSettings;
