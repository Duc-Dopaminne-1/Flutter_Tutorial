import { AppContextState } from '@/screens/App/AppContainer'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { AModal1 } from '@/components/AModal/AModal1'
import { CheckInEventHeader } from './Components/CheckInEventHeader'
import { CheckInEventContent } from './Components/CheckInEventContent'
import { SafeEvent } from '@/shared/event'
import { metrics } from '@/vars'

// init state
const initialState = {
  isVisible: false,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  safeEvent: SafeEvent
}> &
  DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState> & Readonly<{}>

export class CheckInEvent extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  open = () => {
    this.setState({
      isVisible: true,
    })
  }

  closed = () => {
    this.setState({
      isVisible: false,
    })
  }

  onPressGotIt = () => {
    this.closed()
  }

  render() {
    const { isVisible } = this.state
    const { safeEvent } = this.props
    const { eventName } = safeEvent

    return (
      <AModal1
        // @ts-ignore
        modalProps={{
          isVisible,
          useNativeDriver: true,
          hideModalContentWhileAnimating: true,
        }}
        customContainer={styles.customContainer}
      >
        <CheckInEventHeader eventName={eventName} />
        <CheckInEventContent onPressGotIt={this.onPressGotIt} />
      </AModal1>
    )
  }
}

const styles = StyleSheet.create<any>({
  customContainer: {
    height: metrics.check_in_event_modal_height,
    width: metrics.check_in_event_modal_width,
  },
})
