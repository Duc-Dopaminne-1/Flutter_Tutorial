import React from "react";
import Modal from "react-native-modal";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import I18n from 'app/i18n'
import CheckedIcon from "app/assets/images/checked_icon.png";
import UncheckedIcon from "app/assets/images/unchecked_icon.png";
import {colors, fonts} from "../../constants";

class ListModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      selected: [],
    };
  }

  initialize = () => {
    let { data, selected } = this.props;
    let selected_state = data.map((item, index) => {
      if (selected.includes(index)) {
        return true;
      } else {
        return false;
      }
    });
    this.setState({
      selected: selected_state,
    });
  };

  select = (index) => () => {
    let { selected } = this.state;
    if (index === 6) {
      if (!selected[index]) {
        selected = Array(selected.length).fill(false);
        selected[index] = true;
      } else {
        selected[index] = false;
      }
    } else {
      selected[index] = !selected[index];
      selected[6] = false;
    }
    this.setState({ selected });
  };

  handleUpdate = () => {
    let { data, update } = this.props;
    let result = [];
    data.map((item, index) => {
      if (this.state.selected[index]) result.push(index);
    });
    update(result);
    this.hide();
  };

  show = () => {
    this.setState({
      isVisible: true,
    });
  };

  hide = () => {
    this.setState({
      isVisible: false,
    });
  };

  render() {
    let { isVisible, selected } = this.state;
    let { data } = this.props;

    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={this.hide}
        onModalWillShow={this.initialize}
        style={styles.modal}
      >
        <View style={styles.container}>
          <Text style={styles.title}>{I18n.t('selectAll')}</Text>
          {data.map((item, index) => (
            <TouchableOpacity
              style={styles.item}
              key={`${index}`}
              onPress={this.select(index)}
            >
              {selected[index] ? (
                <Image
                  style={styles.icon}
                  source={CheckedIcon}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  style={styles.icon}
                  source={UncheckedIcon}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.doneBtn} onPress={this.handleUpdate}>
            <Text style={styles.doneText}>{I18n.t('doneUpper')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

let styles = StyleSheet.create({
  modal: {
    alignSelf: "stretch",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "80%",
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    marginTop: 10,
    marginBottom: 20,
    fontFamily: fonts.family.HNMedium,
    fontSize: 20,
    color: colors.dark,
    textAlign: "center",
  },
  item: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontFamily: fonts.family.HNLight,
    fontSize: 14,
    color: colors.dark,
  },
  doneBtn: {
    alignSelf: "center",
    paddingHorizontal: 20,
    height: 40,
    backgroundColor: colors.light_blue,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  doneText: {
    fontFamily: fonts.family.HNLight,
    fontSize: 16,
    letterSpacing: 1,
    color: colors.white,
  },
});

ListModal.propTypes = {
  isVisible: PropTypes.bool,
  data: PropTypes.array,
  selected: PropTypes.array,
  update: PropTypes.func,
};

export default ListModal;
