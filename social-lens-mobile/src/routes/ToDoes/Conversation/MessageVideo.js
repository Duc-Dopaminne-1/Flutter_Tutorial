import React from 'react';
import { View, ViewPropTypes, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Video from 'react-native-video';
import YouTube from 'react-native-youtube';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { GOOGLE_API_KEY } from 'app/config';
import {fonts ,colors } from "../../../constants";

class MessageVideo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      paused: false
    };
  }

  stopVideo = () => {
    let { paused } = this.state;
    paused = true;
    this.setState({ paused });
  };

  playVideo = () => {
    let { paused } = this.state;
    paused = false;
    this.setState({ paused });
    this.player.seek(0);
    this.player.presentFullscreenPlayer();
  };

  render() {
    let { containerStyle, videoProps, currentMessage } = this.props;
    let youtubeVideoId = '';
    if (currentMessage.videoType === 'youtube') {
      let elements = currentMessage.video.split('/');
      youtubeVideoId = elements[elements.length - 1];
    }
    return(
      <View style={ containerStyle }>
        {
          currentMessage.videoType === 'youtube' ? (
            <YouTube
              apiKey={GOOGLE_API_KEY}
              videoId={youtubeVideoId}
              play={false}
              fullscreen={true}
              loop={false}
              style={ styles.videoContainer }
            />
          ) : (
            <View style={ styles.videoContainer }>
              <Video 
                {...videoProps} 
                ref={r => { this.player = r; }}
                source={{ uri: currentMessage.video }} 
                style={styles.video} 
                resizeMode='cover'
                paused={this.state.paused}
                onFullscreenPlayerDidDismiss={this.stopVideo}
              />
              <View style={styles.previewOverlay}>
                <TouchableOpacity onPress={this.playVideo}>
                  <Ionicons name="md-arrow-dropright-circle" style={styles.previewPlayBtn} />
                </TouchableOpacity>
              </View>
            </View>
          )
        }
      </View>
    );
  }
}

let styles = StyleSheet.create({
  videoContainer: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    overflow: 'hidden'
  },
  video: {
    alignSelf: 'stretch',
    flex: 1
  },
  previewOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.dark_gray,
    alignItems: 'center',
    justifyContent: 'center'
  },
  previewPlayBtn: {
    fontSize: 30,
    color: colors.white
  }
});

MessageVideo.propTypes ={
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  videoProps: PropTypes.object
};

export default MessageVideo;