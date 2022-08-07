import { normalize } from '@/vars'
import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Modal, { ModalProps } from 'react-native-modal'

type AModal1Props = Readonly<{
  modalProps: ModalProps
  customContainer?: StyleProp<ViewStyle>
}>

type AModal1State = Readonly<{}>

export class AModal1 extends React.PureComponent<AModal1Props, AModal1State> {
  readonly state = {}

  static readonly defaultProps = {}

  render() {
    const { modalProps, children, customContainer } = this.props

    return (
      <Modal {...modalProps} style={styles.modal}>
        <View style={[styles.container, customContainer]}>{children}</View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create<any>({
  modal: {
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    overflow: 'hidden',
    borderRadius: 7,
    height: normalize(421),
    width: normalize(313),
  },
})
