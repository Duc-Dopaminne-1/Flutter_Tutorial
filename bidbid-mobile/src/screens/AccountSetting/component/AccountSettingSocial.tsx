import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { useSelector } from 'react-redux';
import { UserInit } from '@/redux/user/reducer';
import { AccountSettingSocialItem } from '@/screens/AccountSetting/component/AccountSettingSocialItem';
import { IconAppleSquare } from '@/vars/imagesSvg';
import { RuleSocial, VERSION_DEVICE, VERSION_DEVICE_LOGIN_APPLE } from '@/constants/app';
import { appleLogin, googleLogin, logOutGoogleIfNeeded, onLoginFacebook } from '@/shared/Social';
import NavigationActionsService from '@/navigation/navigation';
import { linkSocial, login } from '@/redux/auth/actions';
import { alertError } from '@/shared/alert';
import { isIOS } from '@/shared/devices';
import DefaultText from '@/components/CustomText/DefaultText';
import FbSquareSVG from '@/components/SVG/FbSquareSVG';
import GGSquareSVG from '@/components/SVG/GGSquareSVG';

export function AccountSettingSocial(): ReactElement {
  const user = useSelector((state: UserInit) => state.user.data);
  const [email, setEmail] = useState({});

  useEffect(() => {
    user.authProviders.map(item => {
      if (item.type === RuleSocial.Facebook) {
        setEmail(state => {
          return {
            ...state,
            [RuleSocial.Facebook]: item && item.name ? item.name : item.email,
          };
        });
      } else if (item.type === RuleSocial.Google) {
        setEmail(state => {
          return {
            ...state,
            [RuleSocial.Google]: item.email,
          };
        });
      } else if (item.type === RuleSocial.Apple) {
        setEmail(state => {
          return {
            ...state,
            [RuleSocial.Apple]: item.email,
          };
        });
      }
    });
  }, [user.authProviders]);

  const onSuccess = () => {
    NavigationActionsService.hideLoading();
  };

  const onFail = async (error: string) => {
    NavigationActionsService.hideLoading();
    await logOutGoogleIfNeeded();
    alertError(error, language('error'), null);
  };

  const onCheckUser = (token = '', typeLogin = '') => {
    NavigationActionsService.dispatchAction(
      login({
        token: token,
        provider: typeLogin,
        isCheckExist: true,
        onSuccess: data => {
          if (data?.user) {
            // email Existed
            NavigationActionsService.hideLoading();
            let typeSocial = '';
            if (typeLogin === RuleSocial.Facebook) {
              typeSocial = 'Facebook';
            } else if (typeLogin === RuleSocial.Google) {
              typeSocial = 'Google';
            } else {
              typeSocial = 'Apple ID';
            }
            alertError(language('emailUsed', { type: typeSocial }), language('error'), null);
          } else {
            onLinking(token, typeLogin);
          }
        },
        onFail: () => {
          // email not Exist
          NavigationActionsService.hideLoading();
          // onLinking(token, typeLogin);
        },
      }),
    );
  };

  const onLinking = (token = '', typeLogin = '') => {
    NavigationActionsService.dispatchAction(
      linkSocial({
        userId: user.id,
        accessToken: token,
        type: typeLogin,
        fromSetting: true,
        onSuccess,
        onFail: onFail,
      }),
    );
  };

  const onPressFb = async () => {
    NavigationActionsService.showLoading();
    await onLoginFacebook(onCheckUser);
  };

  const onPressGg = async () => {
    NavigationActionsService.showLoading();
    await googleLogin(onCheckUser);
  };

  const onPressApple = async () => {
    NavigationActionsService.showLoading();
    await appleLogin(onCheckUser);
  };

  const renderSocial = () => {
    return (
      <View style={styles.wrapSocial}>
        <AccountSettingSocialItem
          title={language('facebook')}
          onPress={onPressFb}
          isLinked={!!email[RuleSocial.Facebook]}
          email={email[RuleSocial.Facebook]}
        >
          <FbSquareSVG />
        </AccountSettingSocialItem>

        <AccountSettingSocialItem
          onPress={onPressGg}
          title={language('google')}
          isLinked={!!email[RuleSocial.Google]}
          email={email[RuleSocial.Google]}
        >
          <GGSquareSVG />
        </AccountSettingSocialItem>

        {isIOS && VERSION_DEVICE >= VERSION_DEVICE_LOGIN_APPLE && (
          <AccountSettingSocialItem
            onPress={onPressApple}
            title={language('appleID')}
            isLinked={!!email[RuleSocial.Apple]}
            email={email[RuleSocial.Apple]}
          >
            <IconAppleSquare />
          </AccountSettingSocialItem>
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.wrapHeader}>
        <DefaultText style={styles.textLink}>{language('accountLinking')}</DefaultText>
        <DefaultText style={styles.textSub}>{language('linkAccount')}</DefaultText>
      </View>
      {renderSocial()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: 24,
  },
  textLink: {
    fontSize: fonts.size.s16,
    fontWeight: isIOS ? '600' : 'bold',
    color: colors.gray_900,
  },
  textSub: {
    marginTop: 5,
    color: colors.gray_500,
    fontSize: fonts.size.s14,
  },
  wrapSocial: {
    marginTop: 30,
  },
  wrapHeader: {
    paddingHorizontal: 16,
  },
});
