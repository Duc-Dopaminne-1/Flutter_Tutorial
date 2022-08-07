import React, {useContext, useEffect, useState} from 'react';
import {Image, Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {getVersion} from 'react-native-device-info';

import {useCheckMobileAppVersionStableQuery} from '../../../api/graphql/generated/graphql';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {NAVIGATION_ANIMATION_DURATION} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {Message} from '../../../assets/localize/message/Message';
import {STRINGS} from '../../../assets/localize/string';
import ModalPopup from '../../../components/Modal/ModalPopup';
import UrlUtils from '../../../utils/UrlUtils';
import {styles} from './styles';

const Button = ({style, title, titleStyle, onPress}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={titleStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export const VersionModal = ({onCheckDone}) => {
  const {showAppSpinner, showErrorAlert} = useContext(AppContext);
  const [showPopup, setShowPopup] = useState(false);
  const [isForceUpdate, setForceUpdate] = useState(true);
  const {data, loading, error} = useCheckMobileAppVersionStableQuery({
    variables: {
      input: {
        mobileOs: Platform.OS === 'ios' ? 'iOS' : 'Android',
        mobileVersion: getVersion(),
      },
    },
  });

  useEffect(() => {
    showAppSpinner(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    if (error) {
      onCheckDone();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (!data) {
      return;
    }
    const response = data?.checkMobileAppVersionStable?.mobileAppVersionStable;
    const updateOption = response?.updateOption;
    if (!updateOption) {
      onCheckDone();
      return;
    }
    if (updateOption === 'Force') {
      setForceUpdate(true);
      setShowPopup(true);
    } else if (updateOption === 'Optional') {
      setForceUpdate(false);
      setShowPopup(true);
    } else {
      onCheckDone();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onPressUpdateButton = () => {
    const releaseUrl = data?.checkMobileAppVersionStable?.mobileAppVersionStable?.releaseUrl;
    UrlUtils.openUrl(releaseUrl, () => {
      showErrorAlert(translate(Message.NTW_UNKNOWN_ERROR));
    });
  };

  const onPressSkipButton = () => {
    setShowPopup(false);
    setTimeout(() => {
      onCheckDone();
    }, NAVIGATION_ANIMATION_DURATION);
  };

  if (!showPopup) {
    return null;
  }

  const version = data?.checkMobileAppVersionStable?.mobileAppVersionStable?.mobileVersion;
  const releaseNote = data?.checkMobileAppVersionStable?.mobileAppVersionStable?.releaseNotes;

  return (
    <ModalPopup visible={showPopup} animationType="slide">
      <View style={styles.container}>
        <Image style={styles.image} source={IMAGES.HEADER_UPDATE} />
        <View style={styles.bodyContainer}>
          <View style={styles.versionContainer}>
            <Text style={styles.versionLabel}>Bản Cập Nhật</Text>
            <Text style={styles.versionName}>{`v${version}`}</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.releaseNoteContainer}>
            <Text style={styles.releaseNote}>{releaseNote}</Text>
          </ScrollView>
        </View>
        {isForceUpdate ? (
          <View>
            <View style={styles.buttonContainer}>
              <Button
                style={styles.forceButton}
                titleStyle={styles.forceButtonTitle}
                title={translate(STRINGS.UPDATE)}
                onPress={onPressUpdateButton}
              />
            </View>
          </View>
        ) : (
          <View>
            {<View style={styles.devideVertical} />}
            <View style={styles.buttonContainer}>
              <Button
                titleStyle={styles.skipButton}
                title={translate(STRINGS.SKIP)}
                onPress={onPressSkipButton}
              />
              <View style={styles.devideHorizontal} />
              <Button
                titleStyle={styles.optionUpdateButton}
                title={translate(STRINGS.UPDATE)}
                onPress={onPressUpdateButton}
              />
            </View>
          </View>
        )}
      </View>
    </ModalPopup>
  );
};
