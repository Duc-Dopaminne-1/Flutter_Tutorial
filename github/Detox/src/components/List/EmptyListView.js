import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {EMPTY_TYPE} from '../../assets/constants';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS} from '../../assets/theme/metric';

const styles = StyleSheet.create({
  container: {
    ...HELPERS.center,
    alignSelf: 'center',
    flexGrow: 1,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  iconEmpty: {
    width: 142,
    height: 156,
  },
  text: {
    ...METRICS.horizontalPadding,
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.TEXT_DARK_40,
    textAlign: 'center',
  },
  blackText: {
    color: COLORS.BLACK_33,
  },
  recentAgentBtnText: {
    color: COLORS.PRIMARY_A100,
    fontSize: 14,
    ...FONTS.bold,
  },
  recentAgentBtn: {
    marginTop: 16,
  },
});

export const EmptyListView = ({
  loading,
  error,
  type = EMPTY_TYPE.DEFAULT,
  onPressSeeAgentList = () => {},
  containerStyle,
  isLoading = false,
}) => {
  const isError = !isEmpty(error);
  const centerMessage = () => {
    if (loading) {
      return translate(STRINGS.LOADING);
    }
    if (isError) {
      return error;
    }
    switch (type) {
      case EMPTY_TYPE.RECENT_AGENT:
        return translate('newPost.emptyListRecentAgent');
      case EMPTY_TYPE.SUGGESTED_AGENT:
        return translate('newPost.emptyListAllAgent');
      case EMPTY_TYPE.BUY_REQUEST:
        return translate(STRINGS.REQUEST_EMPTY);
      case EMPTY_TYPE.PAYMENT:
        return translate('payment.emptyListPayment');
      case EMPTY_TYPE.YOUR_PROPERTY_CRAWLER:
        return translate('propertyPost.crawler.emptyList');
      case EMPTY_TYPE.YOUR_PROPERTY:
      case EMPTY_TYPE.CHAT:
        return translate(STRINGS.DO_NOT_HAVE_DATA);
      default:
        return translate(STRINGS.DO_NOT_HAVE_DATA);
    }
  };
  const ContentView = () => {
    switch (type) {
      case EMPTY_TYPE.RECENT_AGENT:
        return (
          <View style={[HELPERS.fillCenter, containerStyle]}>
            {!loading && !isError && (
              <Image
                style={[styles.icon, styles.iconEmpty]}
                source={IMAGES.IC_EMPTY_LIST}
                resizeMode="contain"
              />
            )}
            <Text style={[styles.text, styles.blackText]}>{centerMessage()}</Text>
            {!loading && !isError && (
              <TouchableOpacity style={styles.recentAgentBtn} onPress={onPressSeeAgentList}>
                <Text style={styles.recentAgentBtnText}>
                  {translate('newPost.seeSuggestionList')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      case EMPTY_TYPE.SUGGESTED_AGENT:
        return (
          <View style={[HELPERS.fillCenter, containerStyle]}>
            {!loading && !isError && <Image style={styles.icon} source={IMAGES.IC_EMPTY} />}
            <Text style={[styles.text, styles.blackText]}>{centerMessage()}</Text>
          </View>
        );
      case EMPTY_TYPE.BUY_REQUEST:
      case EMPTY_TYPE.PAYMENT:
      case EMPTY_TYPE.YOUR_PROPERTY:
      case EMPTY_TYPE.YOUR_PROPERTY_CRAWLER:
        return (
          <View style={[HELPERS.fillCenter, containerStyle]}>
            {!loading && !isError && (
              <Image
                style={[styles.icon, styles.iconEmpty, METRICS.verticalPadding]}
                source={IMAGES.IC_EMPTY_LIST}
                resizeMode="contain"
              />
            )}
            <Text style={[styles.text, styles.blackText]}>{centerMessage()}</Text>
          </View>
        );
      case EMPTY_TYPE.CHAT:
        return (
          <View style={[HELPERS.fillCenter, containerStyle]}>
            {!loading && !isError && (
              <Image style={styles.icon} source={IMAGES.IC_EMPTY_CONVERSATION} />
            )}
            <Text style={styles.text}>{centerMessage()}</Text>
          </View>
        );
      default:
        return (
          <View style={[HELPERS.fillCenter, containerStyle]}>
            {!loading && !isError && <Image style={styles.icon} source={IMAGES.IC_EMPTY} />}
            <Text style={styles.text}>{centerMessage()}</Text>
          </View>
        );
    }
  };

  const emptyRecentAgentListStyle = type === EMPTY_TYPE.RECENT_AGENT && {zIndex: 10};
  return (
    <View style={[styles.container, emptyRecentAgentListStyle]}>
      {isLoading ? <ActivityIndicator /> : <ContentView />}
    </View>
  );
};
