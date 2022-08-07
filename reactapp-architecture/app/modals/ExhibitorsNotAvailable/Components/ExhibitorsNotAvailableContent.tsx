import * as React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { colors, fonts, images, metrics, normalize } from '@/vars'
import I18n from '@/i18n'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{}> & DefaultProps

export type State = Readonly<typeof initialState> & Readonly<{}>

export class ExhibitorsNotAvailableContent extends React.PureComponent<
  Props,
  State
> {
  readonly state: State = initialState

  renderLogo = () => {
    return (
      <View style={styles.wrapLogo}>
        <Image
          source={images.exhibitorLogo}
          style={styles.logo}
          resizeMode={'contain'}
        />
      </View>
    )
  }

  renderText = () => {
    return (
      <View style={styles.wrapText}>
        <Text style={styles.title}>{I18n.t('exhibitorNotAvailable')}</Text>

        <Text style={styles.description}>
          {I18n.t('weDonHaveExhibitorsForThisShow')}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderLogo()}
        {this.renderText()}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 5,
  },
  wrapLogo: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: metrics.exhibitor_modal_logo_size,
    width: metrics.exhibitor_modal_logo_size,
  },
  wrapText: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xxl,
    color: colors.dark_blue_grey,
    textAlign: 'center',
  },
  description: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
    color: colors.dark_blue_grey,
    textAlign: 'center',
    marginTop: metrics.exhibitor_modal_description_text_margin,
  },
})
