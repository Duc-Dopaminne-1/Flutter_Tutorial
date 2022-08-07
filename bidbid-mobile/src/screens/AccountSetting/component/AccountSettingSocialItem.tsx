import React, { ReactElement } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { CustomLine } from '@/components/CustomeLine';
import DefaultText from '@/components/CustomText/DefaultText';
import LinkedSVG from '@/components/SVG/LinkedSVG';
import NotLinkedSVG from '@/components/SVG/NotLinkedSVG';

interface Prop {
  children: ReactElement;
  title: string;
  email?: string | undefined;
  isLinked?: boolean;
  onPress?: () => void;
}

export function AccountSettingSocialItem(props: Prop): ReactElement {
  const { onPress, children, title, email = language('noAccount'), isLinked = false } = props;

  const renderSocial = () => {
    return (
      <View style={styles.wrapType}>
        {children}
        <View style={styles.wrapName}>
          <DefaultText style={styles.textTitle}>{title}</DefaultText>
          <DefaultText style={styles.textEmail}>{email}</DefaultText>
        </View>
      </View>
    );
  };

  const renderStatus = () => {
    return (
      <View style={styles.wrapStatus}>
        {isLinked ? (
          <>
            <DefaultText style={styles.textLink}>{language('linked')}</DefaultText>
            <LinkedSVG />
          </>
        ) : (
          <>
            <Text style={styles.textNotLink}>{language('notLinked')}</Text>
            <NotLinkedSVG />
          </>
        )}
      </View>
    );
  };

  const onPressSocial = () => {
    !isLinked && onPress && onPress();
  };

  return (
    <Pressable onPress={onPressSocial}>
      <View style={styles.container}>
        {renderSocial()}
        {renderStatus()}
      </View>
      <CustomLine lineStyle={styles.line} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  line: {
    marginLeft: 16,
  },
  wrapType: {
    flex: 1,
    flexDirection: 'row',
  },
  wrapName: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 12,
    justifyContent: 'space-between',
  },
  textTitle: {
    fontSize: fonts.size.s16,
    color: colors.gray_900,
  },
  textEmail: {
    fontSize: fonts.size.s14,
    color: colors.gray_500,
  },
  wrapStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textLink: {
    color: colors.green_600,
    fontSize: fonts.size.s12,
    marginRight: 10,
  },
  textNotLink: {
    color: colors.gray_600,
    fontSize: fonts.size.s12,
    marginRight: 10,
  },
});
