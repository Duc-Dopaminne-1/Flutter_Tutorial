import { AppContextState } from '@/screens/App/AppContainer'
import * as React from 'react'
import { HomeHeader } from '@/screens/Home/Components/HomeHeader'
import { HomeEvent } from '@/screens/Home/Components/HomeEvent'
import { HomeListProduct } from '@/screens/Home/Components/HomeListProduct'
import { HomeListSupplier } from '@/screens/Home/Components/HomeListSupplier'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { HomeAssigned } from '@/screens/Home/Components/HomeAssigned'
import { Subscription } from 'rxjs'
import { openModalCheckInEventSuccess } from '@/services/global'
import { CheckInEvent } from '@/modals/CheckInEvent/CheckInEvent'
import { SafeEvent } from '@/shared/event'

type Props = {
  onPressOpenMenu: () => void
} & AppContextState

type State = Readonly<{
  safeEvent: SafeEvent
}>

export class HomeContent extends React.PureComponent<Props, State> {
  _openModalCheckInSub: Subscription
  _modalCheckInEvent: React.RefObject<CheckInEvent> = React.createRef()

  readonly state: State = {
    safeEvent: new SafeEvent(null),
  }

  componentDidMount() {
    this._openModalCheckInSub = openModalCheckInEventSuccess.subscribe(
      value => {
        const { isOpen, safeEvent } = value

        this.setState(
          {
            safeEvent,
          },
          () => {
            isOpen &&
              this._modalCheckInEvent.current &&
              this._modalCheckInEvent.current.open()
          }
        )
      }
    )
  }

  componentWillUnmount() {
    this._openModalCheckInSub && this._openModalCheckInSub.unsubscribe()
  }

  render() {
    const { safeEvent } = this.state
    const { onPressOpenMenu } = this.props

    return (
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <HomeHeader isShowDot={false} onPressOpenMenu={onPressOpenMenu} />
        <HomeAssigned />
        <HomeEvent />
        <HomeListProduct />
        {/*<HomeListSupplier />*/}

        {/* Modal */}
        <CheckInEvent ref={this._modalCheckInEvent} safeEvent={safeEvent} />
      </KeyboardAwareScrollView>
    )
  }
}
