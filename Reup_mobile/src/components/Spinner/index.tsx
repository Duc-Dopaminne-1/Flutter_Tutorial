
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";

import { styles } from "./styles";
import Modal from 'react-native-modal';
import { WIDTH } from "@src/constants/vars";

export interface Props {
  loading: boolean;
  dimBackground?: boolean;
  text?: string;
  showText?: boolean;
}

export default class Spinner extends Component<Props> {
  render() {
    const {
      loading,
      dimBackground = true,
      text = "Loading...",
      showText = true,
      ...props
    } = this.props;

    const modalBackgroundColor = dimBackground
      ? { backgroundColor: "#00000040" }
      : null;

    return (
      <Modal
        isVisible={loading}
        hideModalContentWhileAnimating
        useNativeDriver
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        style={styles.container}
      >
        <View style={[styles.modalBackground, modalBackgroundColor]}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" animating={loading} />
            {showText ? (
              <Text allowFontScaling={false} style={styles.text} numberOfLines={1}>
                {text}
              </Text>
            ) : null}
          </View>
        </View>
      </Modal>
    );
  }
}
