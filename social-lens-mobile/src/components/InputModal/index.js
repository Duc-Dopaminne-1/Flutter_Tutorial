import React from 'react';
import Modal from 'react-native-modal';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import {colors, fonts} from "../../constants";
import I18n from 'app/i18n'

class InputModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      value: ''
    };
  }

  show = () => {
    this.setState({
      isVisible: true
    });
  };

  hide = () => {
    this.setState({
      isVisible: false
    });
  }

  initialize = () => {
    this.setState({
      value: this.props.value
    });
  };

  handleInputChange = (value) => {
    this.setState({ value });
  }

  handleUpdate = () => {
    this.props.update(this.state.value);
    this.hide();
  }

  render() {
    let { isVisible } = this.state;
    let { title } = this.props;

    return(
      <Modal
        isVisible={isVisible}
        onBackdropPress={this.hide}
        onModalWillShow={this.initialize}
        style={ styles.modal }
      >
        <View style={ styles.container }>
          <Text style={ styles.title }>
            {title}
          </Text>
          <TextInput 
            style={ styles.input }
            multiline={true}
            numberOfLines={5}
            autoCapitalize='none'
            value={this.state.value}
            placeholder={I18n.t('typeURL')}
            onChangeText={this.handleInputChange}
          />
          <TouchableOpacity style={ styles.doneBtn } onPress={ this.handleUpdate }>
            <Text style={ styles.doneText}>{I18n.t('doneUpper')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

let styles = StyleSheet.create({
  modal: {
    alignSelf: 'stretch',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: colors.white
  },
  title: {
    marginVertical: 10,
    fontFamily: fonts.family.HNMedium,
    fontSize: 20,
    color: colors.dark,
    textAlign: 'center'
  },
  input: {
    alignSelf: 'stretch',
    height: 100,
    fontFamily: fonts.family.HNLight,
    fontSize: 14,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.input_gray,
    paddingHorizontal: 10,

  },
  doneBtn: {
    alignSelf: 'center',
     paddingHorizontal: 20,
    height: 40,
    backgroundColor: colors.light_blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  doneText: {
    fontFamily: fonts.family.HNLight,
    fontSize: 16,
    letterSpacing: 1,
    color: colors.white
  }
});

InputModal.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  update: PropTypes.func
};

export default InputModal;