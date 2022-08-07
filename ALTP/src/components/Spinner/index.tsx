////// Use code simple in screen

// import Spinner from '@src/components/Spinner';

// Needs initialization state "loading" where you want it displayed

// <Spinner loading={this.state.loading} dimBackground={true} showText={true} text="Loading"/>

import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native'
import Modal from 'react-native-modal'
import { SpinnerStyle } from './styles'

export interface Style {
  text: TextStyle
  modalBackground: ViewStyle
  activityIndicatorWrapper: ViewStyle
}

export interface Props {
  loading: boolean
  dimBackground: boolean
  text: string
  showText: boolean
  onPressOut?: () => void
}

export default class Spinner extends Component<Props> {
  render() {
    const {
      loading,
      dimBackground = true,
      text = 'Loading...',
      showText = true,
      onPressOut,
      ...props
    } = this.props

    const styles = StyleSheet.create(SpinnerStyle)
    const modalBackgroundColor = dimBackground
      ? { backgroundColor: 'black' }
      : null

    return (
      <Modal
        customBackdrop={
          <TouchableWithoutFeedback onPress={onPressOut}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#000000'
              }}
            />
          </TouchableWithoutFeedback>
        }
        animationInTiming={5}
        backdropTransitionInTiming={5}
        animationOutTiming={5}
        backdropTransitionOutTiming={5}
        // animationType={"none"}
        isVisible={loading}
        style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" animating={loading} />
          {showText ? (
            <Text style={styles.text} numberOfLines={2}>
              {text}
            </Text>
          ) : null}
        </View>
      </Modal>
    )
  }
}
