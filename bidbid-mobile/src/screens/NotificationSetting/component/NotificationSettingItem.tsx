import React, { ReactElement } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { CustomLine } from '@/components/CustomeLine';
import { isIOS } from '@/shared/devices';

interface Prop {
  title?: string;
  content: string;
  isEnabled?: boolean;
  toggleSwitchCallBack?: (isEnabled: boolean, type: string) => void;
  type: string;
}
function NotificationSettingItem(props: Prop): ReactElement {
  const { title, content, isEnabled = false, toggleSwitchCallBack, type } = props;

  const toggleSwitch = () => {
    toggleSwitchCallBack && toggleSwitchCallBack(!isEnabled, type);
  };

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.textTitle}>{title}</Text> : null}
      <View style={styles.wrapItem}>
        <Text style={styles.textContent}>{content}</Text>
        <Switch
          trackColor={{ false: colors.gray_300, true: colors.red_600 }}
          thumbColor={isEnabled ? colors.white : colors.white}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <CustomLine />
    </View>
  );
}

export default React.memo(NotificationSettingItem);

const styles = StyleSheet.create({
  container: {},
  textTitle: {
    color: colors.gray_900,
    fontSize: fonts.size.s16,
    fontWeight: isIOS ? '600' : 'bold',
    fontFamily: fonts.family.PoppinsRegular,
  },
  textContent: {
    color: colors.gray_700,
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.PoppinsRegular,
  },
  wrapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
});
