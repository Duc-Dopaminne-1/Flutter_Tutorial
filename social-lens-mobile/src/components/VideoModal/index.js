import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from "../../constants";

class VideoModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      paused: false
    };
  }

  show() {
    this.setState( {
      visible: true 
    });
  }

  initialize = () => {
    this.setState({
      paused: false
    });
  }

  onClose = () => {
    this.setState({
      paused: true,
      visible: false
    });
  }

  render() {
    return (
      <Modal 
        animationType="slide" 
        onModalShow={this.initialize}
        isVisible={this.state.visible}
        style={ styles.container}
      >
        <View style={ styles.content }>
          <Video
            style={styles.video}
            source={ this.props.uri }
            paused={this.state.paused}
          />
          <TouchableOpacity style={styles.close} onPress={this.onClose}>
            <Ionicons name="md-close-circle" size={32} color='#fff' />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width,
    flex: 1,
    alignSelf: 'center',
    marginVertical: 0
  },
  content: {
    alignSelf: 'stretch',
    flex: 1,
    backgroundColor: colors.black
  },
  video: {
    alignSelf: 'stretch',
    flex: 1
  },
  close: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

VideoModal.propTypes = {
  uri: PropTypes.object
};

export default VideoModal;