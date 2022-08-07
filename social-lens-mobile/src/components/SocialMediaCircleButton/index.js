import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import FacebookIcon from 'app/assets/images/facebook.png';
import TwitterIcon from 'app/assets/images/twitter.png';
import YoutubeIcon from 'app/assets/images/youtube.png';
import LinkedinIcon from 'app/assets/images/linkedin.png';
import InstagramIcon from 'app/assets/images/instagram.png';
import {colors} from "../../constants";

class SocialMediaCircleButton extends React.Component {
  render() {
    let { containerStyle, enabled, touchable, type, onPress } = this.props;
    let btnStyle = {}, icon;
    switch(type) {
    case 'facebook':
      btnStyle = { backgroundColor: '#3c5a9a' };
      icon = FacebookIcon;
      break;
    case 'twitter':
      btnStyle = { backgroundColor: '#1da1f2' };
      icon = TwitterIcon;
      break;
    case 'youtube':
      btnStyle = { backgroundColor: '#f53e39' };
      icon = YoutubeIcon;
      break;
    case 'linkedin':
      btnStyle = { backgroundColor: '#006699' };
      icon = LinkedinIcon;
      break;
    case 'instagram':
      btnStyle = { backgroundColor: '#ff1493' };
      icon = InstagramIcon;
      break;
    default:
      break;
    }
    return (
      <TouchableOpacity 
        disabled={!touchable}
        style={[ styles.container, btnStyle, containerStyle ]} 
        onPress={onPress}>
        <Image source={icon} style={ styles.icon } resizeMode='contain'/>
        { !enabled && (
          <View style={ styles.overlay} />
        )}
      </TouchableOpacity>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  icon: {
    width: 20,
    height: 20
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.gray075
  }
});

SocialMediaCircleButton.propTypes = {
  containerStyle: PropTypes.object,
  enabled: PropTypes.bool,
  touchable: PropTypes.bool,
  type: PropTypes.string,
  onPress: PropTypes.func
};

export default SocialMediaCircleButton;