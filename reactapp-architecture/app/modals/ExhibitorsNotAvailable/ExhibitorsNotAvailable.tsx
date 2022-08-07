import * as React from 'react'
import { AModal1 } from '@/components/AModal/AModal1'
import { ExhibitorsNotAvailableContent } from '@/modals/ExhibitorsNotAvailable/Components/ExhibitorsNotAvailableContent'
import { Linking, StyleSheet, View } from 'react-native'
import { colors, metrics, normalize } from '@/vars'
import { AButton } from '@/components/AButton/AButton'
import I18n from '@/i18n'
import { email } from '@/common/constants/Email'

// init state
const initialState = {
  isVisible: false,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{}> & DefaultProps

export type State = Readonly<typeof initialState> & Readonly<{}>

export class ExhibitorsNotAvailable extends React.PureComponent<Props, State> {
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

  onPressEmail = async () => {
    const title = 'Hello'
    const body = 'I would like to have exhibitors.'
    const url = `mailto:${email}?subject=${title}&body=${body}`

    const canOpen = await Linking.canOpenURL(url)

    if (canOpen) {
      await Linking.openURL(url)
    } else {
      alert(I18n.t('canOpenMailApp'))
    }
  }

  onPressOK = () => {
    this.closed()
  }

  render() {
    const { isVisible } = this.state

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
        <ExhibitorsNotAvailableContent />

        <View style={styles.wrapFooter}>
          <AButton
            onPress={this.onPressEmail}
            title={I18n.t('emailUs')}
            containerStyle={[styles.buttonContainer, styles.buttonOneContainer]}
            titleStyle={styles.buttonOneTitle}
          />
          <AButton
            onPress={this.onPressOK}
            title={I18n.t('ok')}
            containerStyle={styles.buttonContainer}
          />
        </View>
      </AModal1>
    )
  }
}

const styles = StyleSheet.create<any>({
  customContainer: {
    height: metrics.exhibitor_modal_height,
    width: metrics.exhibitor_modal_width,
  },
  wrapFooter: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: metrics.keylines_screen_profile_title_margin,
  },
  buttonContainer: {
    height: metrics.exhibitor_modal_button_height,
    margin: 0,
    width: metrics.exhibitor_modal_button_width,
    borderRadius: metrics.small_base,
  },
  buttonOneContainer: {
    marginRight: metrics.keylines_screen_product_info_margin,
    backgroundColor: colors.close_icon_gray,
  },
  buttonOneTitle: {
    color: colors.blue_light_grey,
  },
})
