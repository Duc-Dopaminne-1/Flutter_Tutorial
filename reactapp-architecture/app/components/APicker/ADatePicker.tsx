import * as React from 'react'
import { DatePickerIOS, DatePickerAndroid } from 'react-native'
import { Direction } from 'tty'
import { devices } from '@/vars'
import { AModal4 } from '../AModal/AModal4'

type ADatePickerState = Readonly<{
  selectedDate: Date
}>

type ADatePickerProps = Readonly<{
  initialDate: Date
  onDateSelect: (date: Date) => void
  pickerModeAndroid?: 'calendar' | 'spinner' | 'default'
}>

export class ADatePicker extends React.PureComponent<
  ADatePickerProps,
  ADatePickerState
> {
  _modal?: React.RefObject<AModal4> = React.createRef()

  static defaultProps = {
    initialDate: new Date(),
    onDateSelect: () => null,
    pickerModeAndroid: 'spinner',
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedDate: this.props.initialDate || new Date(),
    }
  }

  open = () => {
    this._modal && this._modal.open()
  }

  close = () => {
    this._modal && this._modal.close()
  }

  onClose = () => {}

  /**
   * Show Date Picker
   */
  show = () => {
    if (devices.isIOS) {
      this.open()
      return
    }
    const { pickerModeAndroid } = this.props
    DatePickerAndroid.open({
      date: this.state.selectedDate,
      mode: pickerModeAndroid,
    })
      .then(({ action, year, month, day }) => {
        if (action === DatePickerAndroid.dateSetAction) {
          const date = new Date(year, month, day)
          this.props.onDateSelect(date)
        }
      })
      .catch(error => {
        console.warn('Cannot open date picker', error)
      })
  }

  onModalValueMove = (direction: Direction) => {
    const { selectedDate } = this.state

    const date = new Date(selectedDate)
    date.setDate(selectedDate.getDate() + (direction === 1 ? 1 : -1))
    this.setState({ selectedDate: date })
  }

  onModalComplete = () => {
    this._modal && this._modal.close()
    this.props.onDateSelect(this.state.selectedDate)
  }

  render() {
    if (devices.isAndroid) {
      return null
    }
    const { selectedDate } = this.state
    const modalProps = {
      onClose: this.onClose,
      scrollEnabled: false,
    }

    return (
      <AModal4
        ref={nodeRef => (this._modal = nodeRef)}
        modalProps={modalProps}
        onMove={this.onModalValueMove}
        onComplete={this.onModalComplete}
        hideClearButton={true}
        useFromModal={false}
      >
        <DatePickerIOS
          date={selectedDate}
          mode="date"
          onDateChange={date => this.setState({ selectedDate: date })}
        />
      </AModal4>
    )
  }
}
