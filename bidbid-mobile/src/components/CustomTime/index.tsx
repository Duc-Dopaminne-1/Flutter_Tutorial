import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import { colors, fonts } from '@/vars';
import store from '@/redux/store';
import TickTimeSVG from '@/components/SVG/TickTimeSVG';

const TIME_FORMAT = 'LT';

const Text_Style = {
  color: colors.gray_500,
  fontSize: fonts.size.s12,
  backgroundColor: 'transparent',
  fontFamily: fonts.family.PoppinsRegular,
  textAlign: 'right',
};

const styles = {
  wrapTime: {
    marginRight: 4,
  },
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 5,
    },
    text: Text_Style,
  }),
  right: StyleSheet.create({
    // eslint-disable-next-line react-native/no-unused-styles
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 5,
    },
    // eslint-disable-next-line react-native/no-unused-styles
    text: Text_Style,
  }),
};
export class TimeChat extends Component<any, any> {
  static defaultProps = {
    position: 'left',
    currentMessage: {
      createdAt: null,
    },
    containerStyle: {},
    timeFormat: TIME_FORMAT,
    timeTextStyle: {},
  };

  render() {
    const { position, containerStyle, currentMessage, timeFormat, timeTextStyle } = this.props;

    if (!!currentMessage && store.getState().user.data.id === currentMessage.user._id) {
      return (
        // eslint-disable-next-line react/jsx-filename-extension
        <View style={[styles[position].container, containerStyle && containerStyle[position]]}>
          <View style={styles.wrapTime}>
            <TickTimeSVG />
          </View>

          <Text style={[styles[position].text, timeTextStyle && timeTextStyle[position]]}>
            {dayjs(currentMessage.createdAt).locale('en').format(timeFormat)}
          </Text>
        </View>
      );
    }
    return null;
  }
}
