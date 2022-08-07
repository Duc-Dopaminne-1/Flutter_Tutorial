import React from "react";
import "react-native-get-random-values";
import {View, Text} from "react-native";
import * as Progress from 'react-native-progress';
import {processBar} from "../../../shared/global";
import Modal from 'react-native-modal';
import {colors} from "../../../constants";
import styles from './styles'
import I18n from 'app/i18n'

export default class QuestionModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
        total: 0
    }
  }

  componentDidMount() {
    processBar.subscribe(data => {
        this.setState({
            loading: data.showLoading,
            total: data.total
        })
    })
  }

    render() {
    const { loading, total } = this.state
    const data = Math.round(total * 100) / 100

    return (
        <>
        <Modal
            animationInTiming={5}
            backdropTransitionInTiming={5}
            animationOutTiming={5}
            backdropTransitionOutTiming={5}
            isVisible={loading}
            style={styles.modal}
        >
          <View style={styles.container}>
              <Text style={styles.title} >{I18n.t('uploading', {
                  data: data
              })}</Text>
              <Progress.Bar showsText color={colors.accent} progress={data/100} width={200} />
          </View>
        </Modal>
          </>
    )
  }
}
