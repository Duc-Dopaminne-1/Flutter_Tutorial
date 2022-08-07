import { withContext } from '@/shared/withContext'
import { fonts, metrics } from '@/vars'
import { colors } from '@/vars/colors'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import { SafeEvent } from '@/shared/event'
import { EventInfoContext } from '@/screens/EventInfo/EventInfoContext'
import { AViewMoreText } from '@/components/AViewMoreText/AViewMoreText'

type Props = Partial<{
  safeEvent?: SafeEvent
}> &
  Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{}>

@withContext(EventInfoContext.Consumer)
export class EventInfoDescription extends React.PureComponent<Props, State> {
  readonly state: State = {}

  render() {
    const { safeEvent } = this.props
    const { descriptionText } = safeEvent

    if (!descriptionText) return null

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('description')}</Text>

        <AViewMoreText
          numberOfLines={4}
          key={this.props.descriptionKey}
          viewMoreText={'View More'}
          viewLessText={'View Less'}
          viewMoreTextContainerStyle={styles.viewMoreTextContainerStyle}
          viewMoreTextStyle={styles.viewTextStyle}
          textStyle={styles.description}
        >
          {descriptionText}
        </AViewMoreText>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.keylines_screen_product_info_margin,
    paddingTop: metrics.keylines_screen_profile_title_margin,
    paddingBottom: 100,
  },
  title: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xl,
    color: colors.dark_blue_grey,
    marginBottom: 11,
  },
  description: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
  viewMoreTextContainerStyle: {
    backgroundColor: colors.transparent,
    width: metrics.screen_width / 3,
    alignSelf: 'center',
  },
  viewTextStyle: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.primary_blue,
  },
})
