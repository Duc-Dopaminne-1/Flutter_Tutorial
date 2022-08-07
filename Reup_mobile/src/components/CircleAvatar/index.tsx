import React, { Component, useState } from "react";
import { Image, StyleProp, ImageStyle, View, ActivityIndicator, Platform } from "react-native";
import { styles } from "./styles";
import * as vars from "@constants/vars";
import { DefaultAvatar } from '@src/components/DefaultAvatar';
import { Avatar } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { boolean } from "yup";
import { times } from "lodash";

export interface Props {
  textSize?: number;
  font?: string;
  name: string;
  avatar?: string;
  size?: number;
  resizeMode?: string;
  borderColor?: string;
}
type State = {
  isLoading: boolean;
};

class CircleAvatar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  render() {
    const { size = 60, textSize = size < 60 ? 16 : 21, name, avatar = '', resizeMode = 'cover', borderColor = 'white' } = this.props;
    const getUriImage = () => {
      if (Platform.OS === 'ios') {
        return avatar && typeof avatar === 'string' ? avatar : null
      } else {
        if (avatar && typeof avatar === 'string') {
          if (avatar.includes("http") || avatar.includes("file://")) {
            return avatar;
          }
        }
        return '';
      }
    }
    const normalisedAvatar = getUriImage();

    return (
      <View style={{
        justifyContent: 'center', alignItems: 'center',
        height: size, width: size,
        borderColor: borderColor, borderWidth: 1,
        borderRadius: size / 2, overflow: 'hidden',
      }}>
        <DefaultAvatar
          size={size}
          name={name}
          textStyle={[styles.avatarText, { fontSize: textSize }]}
          containerStyle={styles.container}
        />
        <FastImage style={{
          position: 'absolute',
          height: size,
          width: size,
        }}
          source={{
            uri: normalisedAvatar ?? '',
            // priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
          onLoadStart={() => {
            this.setState({ isLoading: true });
          }}
          onLoadEnd={() => {
            this.setState({ isLoading: false });
          }}
        />
        {this.state.isLoading && <ActivityIndicator size='small' color='white' style={{ position: 'absolute', }} />}
      </View>
    );
  }
}

export default React.memo(CircleAvatar);
