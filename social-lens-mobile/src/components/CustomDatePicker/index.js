import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment';
import { styles } from './styles';
import I18n from 'app/i18n'

class CustomDatePicker extends Component {

  tmpDate = moment();

  constructor(props) {
    super(props);
    const { selectedDate } = this.props;
    let sDate = !selectedDate ? null : this.dateFromString(selectedDate)
    let tDate = this.dateToString(sDate);
    this.tmpDate = sDate;
    this.state = {
      value: tDate,
      showPicker: false,
      selectedDate: sDate ?? moment()
    }

    this.onChange = this.onChange.bind(this);
  }

  dateToString = (date) => {
    return !date ? '' : moment(date).format('MM-DD-YYYY')
  }

  dateFromString = (strDate) => {
    return moment(strDate, "MM-DD-YYYY");
  }

  setShowDate = () => {
    this.setState({
      showPicker: true,
    });
  };

  onBackdropPress = () => {
    this.setState({
      showPicker: false
    });
  };

  onConfirmBtnPressed = () => {
    const strDate = this.dateToString(this.state.selectedDate);
    this.setState({
      showPicker: false,
      value: strDate
    });

    this.props.onDatePicked(strDate);
  };

  onChange = (event, selectedDate) => {
    if (Platform.OS === 'ios') {
      const currentDate = selectedDate || date;
      this.tmpDate = currentDate;
      this.setState({
        selectedDate: selectedDate
      });
    } else {
      //Android
      if (event.type === 'set') {
        //pressed OK
        const strDate = this.dateToString(selectedDate);
        this.setState({
          selectedDate: selectedDate,
          showPicker: false,
          value: strDate
        });
        this.props.onDatePicked(strDate);
      } else if (event.type == 'dismissed') {
        //pressed CANCEL
        this.setState({
          showPicker: false,
        });
      }
    }
  };

  render() {
    const { showPicker, selectedDate, value } = this.state;
    const styleTitle = value !== "" ? styles.infoText : styles.infoTextPlaceholder;
    const valueTitle = value !== "" ? value : I18n.t('selectBirthdate');
    if (Platform.OS === 'ios') {
      return (
        <View>
          <TouchableOpacity onPress={this.setShowDate} style={[styles.infoInput, { justifyContent: 'center' }]}>
            <Text allowFontScaling={false} style={styleTitle}>{valueTitle}</Text>
          </TouchableOpacity>
          <Modal
            animated
            animationType="fade"
            transparent
            onBackdropPress={this.onBackdropPress}
            onBackButtonPress={this.onBackdropPress}
            isVisible={showPicker}
            style={{ margin: 0 }}
          >
            <TouchableOpacity style={styles.container}
              onPress={this.onBackdropPress}>
              <View>
                <View style={styles.headerPicker}>
                  <TouchableOpacity onPress={this.onBackdropPress} >
                    <Text style={styles.cancelBtnText} >{I18n.t('cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.onConfirmBtnPressed} >
                    <Text style={styles.confirmBtnText} >{I18n.t('confirm')}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.fullDivider} />
                <DateTimePicker
                  style={{
                    height: 200,
                    width: '100%',
                    backgroundColor: 'white',
                  }}
                  value={moment(selectedDate).toDate()}
                  mode={'date'}
                  display="default"
                  onChange={this.onChange}
                  format='MM-DD-YYYY'
                />
              </View>

            </TouchableOpacity>
          </Modal >
        </View >
      );
    } else {
      return (
        <>
          <TouchableOpacity onPress={this.setShowDate} style={[styles.infoInput, { justifyContent: 'center' }]}>
            <Text allowFontScaling={false} style={styleTitle}>{valueTitle}</Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              style={{
                height: 200,
                width: '100%',
                backgroundColor: 'white',
              }}
              value={moment(selectedDate).toDate()}
              mode={'date'}
              display="default"
              onChange={this.onChange}
              format='MM-DD-YYYY'

            />
          )}
        </>
      )
    }

  }
}

CustomDatePicker.propTypes = {
  onDatePicked: PropTypes.func,

}

export default CustomDatePicker;

