import { colors, fonts, images, metrics, normalize } from '@/vars'
import * as React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import I18n from 'react-native-i18n'
import { AButton } from '@/components/AButton/AButton'
import { searchKeywordDashboard } from '@/services/global'
import { Subscription } from 'rxjs'

type Props = Readonly<{
  hide: boolean
  keywordFromProps?: string
}> &
  Partial<NavigationInjectedProps<{}>>

export type State = Readonly<{
  keyword: string
}>

@(withNavigation as any)
export class APlaceholderMultiSearch extends React.PureComponent<Props, State> {
  _fetchKeywordSub: Subscription

  readonly state: State = {
    keyword: '',
  }

  componentDidMount() {
    const { keywordFromProps } = this.props

    if (!keywordFromProps) {
      this._fetchKeywordSub = searchKeywordDashboard.subscribe(data => {
        this.setState({
          keyword: data.text,
        })
      })
    }
  }

  componentWillUnmount() {
    this._fetchKeywordSub && this._fetchKeywordSub.unsubscribe()
  }

  onPress = () => {
    this.props.navigation.goBack()
  }

  render() {
    const { hide, keywordFromProps } = this.props
    const { keyword } = this.state
    const title = I18n.t('noResultMultiSearch', {
      keyword: keywordFromProps ? keywordFromProps : keyword,
    })

    if (hide) return null

    return (
      <View style={styles.container}>
        <Image source={images.multiSearch} style={styles.logo} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>
          {I18n.t('pleaseUpdateYourSearch')}
        </Text>
        <AButton
          title={I18n.t('goBack')}
          onPress={this.onPress}
          containerStyle={styles.buttonCustomContainer}
          titleStyle={styles.buttonCustomTitle}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  logo: {
    height: normalize(128),
    width: normalize(128),
  },
  title: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
    color: colors.dark_blue_grey,
    marginTop: normalize(21),
  },
  description: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
    color: colors.dark_blue_grey,
    marginTop: normalize(8),
  },
  buttonCustomContainer: {
    height: normalize(40),
    width: normalize(131),
    margin: 0,
    marginTop: normalize(24),
    borderRadius: metrics.small_base,
  },
  buttonCustomTitle: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
  },
})
