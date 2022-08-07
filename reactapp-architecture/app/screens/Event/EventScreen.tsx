import I18n from '@/i18n'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import {
  DrawerActions,
  NavigationInjectedProps,
  withNavigation,
} from 'react-navigation'
import { Product } from '@/models/team'
import { colors } from '@/vars'
import { AScrollableTabViewEvent } from '@/components/AScrollableTabView/AScrollableTabViewEvent'
import { SearchKeywordType } from '@/services/global'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { EventQuery } from '@/screens/Event/component/EventQuery'
import { EventData } from '@/services/globalEvent'
import { EventCloseToMeQuery } from '@/screens/Event/component/EventCloseToMeQuery'

type Props = Partial<
  NavigationInjectedProps<{
    isFromMenu?: boolean
  }>
> &
  AppContextState

export type State = Readonly<{
  layoutWidth: number
  selectedItem: Product
  selectedIndex: number
}>

@(withNavigation as any)
@withContext(AppContext.Consumer)
export class EventScreen extends React.PureComponent<Props, State> {
  readonly state: State = {
    layoutWidth: 0,
    selectedItem: null,
    selectedIndex: 0,
  }

  onLayout = event => {
    const { width } = event.nativeEvent.layout
    this.setState({
      layoutWidth: width,
    })
  }

  onPressBack = () => {
    const { navigation } = this.props
    const isFromMenu = navigation.getParam('isFromMenu', false)

    if (isFromMenu) {
      navigation.dispatch(DrawerActions.closeDrawer())
      navigation.navigate('HomeScreen', {})
      return
    }

    navigation.goBack(null)
  }

  render() {
    return (
      <View style={styles.container}>
        <AScrollableTabViewEvent
          onPressBack={this.onPressBack}
          placeholderSearch={I18n.t('searchEvents')}
          focusPlaceholderSearch={I18n.t('searchText')}
        >
          <EventQuery
            tab={EventData.Future}
            tabLabel={I18n.t('futureEvent')}
            type={SearchKeywordType.FutureEvent}
          />
          <EventCloseToMeQuery
            tab={EventData.Close}
            tabLabel={I18n.t('closeToMe')}
            type={SearchKeywordType.CloseToMe}
          />
          <EventQuery
            tab={EventData.Past}
            tabLabel={I18n.t('pastEvents')}
            type={SearchKeywordType.PastEvents}
          />
        </AScrollableTabViewEvent>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
  },
  detail: {
    flex: 1.2,
    borderLeftWidth: 1,
    borderLeftColor: colors.border_header,
  },
})
