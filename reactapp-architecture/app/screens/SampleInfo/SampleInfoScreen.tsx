import * as React from 'react'
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { NavigationInjectedProps } from 'react-navigation'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { Sample } from '@/models/team'
import { navigation, Screen } from '@/navigation/navigation'
import { SampleData, sampleNavigation } from '@/navigation/sampleNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { SampleInfoContent } from '@/screens/SampleInfo/Components/SampleInfoContent'
import { NavigationService } from '@/services/navigation'
import { isIpad, isIphoneX } from '@/shared/devices'
import { withContext } from '@/shared/withContext'
import { devices } from '@/vars'
import { Subscription } from 'rxjs'
import { SampleInfoImage } from './Components/SampleInfoImage'
import { SampleInfoContext } from './SampleInfoContext'
import { Dimension, Orientation } from '@/services/dimension'
import I18n from '@/i18n'
import {
  onSampleChangeById,
  updateSampleInfo,
  onDeleteSample,
  onItemCreated,
} from '@/services/global'
import { CustomAlert } from '@/shared/alert'
import { SampleInfoActionBar } from '@/screens/SampleInfo/Components/SampleInfoActionBar'
import { SafeSample } from '@/shared/sample'
import { sampleStore } from '@/stores/sampleStore'

// init state
const initialState = {
  sample: null,
  loading: true,
  errMsg: null,
  headerVisible: true,
  imageData: [],
  keyboardIsShowUp: false,
  dimension: Dimension.isPortrait
    ? Orientation.Portrait
    : Orientation.Landscape,
  isBack: false,
  disableActionBar: false,
}

type Props = Readonly<{
  imageData: string[]
  wasCreated: boolean
  layoutWidth: number
  asComponent: boolean
  selectedIndex: number
}> &
  NavigationInjectedProps<{
    imageData: string[]
    wasCreated: boolean
    sample: Sample
    sampleId: string
  }> &
  AppContextState

export type State = Readonly<{
  sample: Sample
  loading: boolean
  errMsg: string
  headerVisible: boolean
  imageData: string[]
  dimension: any
  keyboardIsShowUp: boolean
  isBack: boolean
  disableActionBar: boolean
}>

@withContext(AppContext.Consumer)
export class SampleInfoScreen extends React.PureComponent<Props, State> {
  _navListener = new NavigationService(this.props.navigation)
  _subscription: Subscription
  _subscriptionRotate: Subscription
  _onDeleteSampleSubscription: Subscription
  _results: Realm.Results<Sample>
  _timer: NodeJS.Timeout = null
  _isDeletedByMyself = false
  _safeSample: SafeSample = new SafeSample(null)

  static readonly defaultProps = {
    sampleId: '',
    imageData: [],
  }

  constructor(props) {
    super(props)
    navigation.currentScreen = Screen.SampleInfo
    const sample = this.props.navigation.getParam('sample', {} as any)
    this.state = {
      ...initialState,
      sample,
    }
  }

  componentDidMount() {
    sampleNavigation.sampleId = []
    const {
      navigation,
      sampleFactory,
      asComponent,
      imageData: _imageData,
    } = this.props

    this._navListener.didFocus(() => {
      !asComponent && StatusBar.setBarStyle('light-content', true)
      devices.isAndroid && AndroidKeyboardAdjust.setAdjustResize()
    })

    const sampleId = this.state.sample.id || navigation.getParam('sampleId', '')
    const imageData = navigation.getParam('imageData', _imageData)

    const [subscription, results] = sampleFactory.fetchById(sampleId, true)

    this._results = results

    this._subscription = subscription.subscribe(data => {
      this.setSampleData(data.col, imageData)

      if (data.change.deletions.length === 0) {
        onSampleChangeById.next(data.col)
      }
    })

    this._onDeleteSampleSubscription = onDeleteSample.subscribe(() => {
      this.props.navigation.goBack()
    })

    this.handleRotate()
  }

  componentWillUnmount() {
    this._navListener.removeListener()
    this._subscription && this._subscription.unsubscribe()
    this._subscriptionRotate && this._subscriptionRotate.unsubscribe()
    this._onDeleteSampleSubscription &&
      this._onDeleteSampleSubscription.unsubscribe()
    this._results && this._results.removeAllListeners()
    clearTimeout(this._timer)

    devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()

    navigation.removeLastScreen()
    sampleNavigation.clear()
  }

  get isActiveHeader() {
    const { headerVisible } = this.state
    const { asComponent } = this.props

    if (!asComponent) {
      return headerVisible
    }

    return headerVisible && !isIpad()
  }

  handleRotate = () => {
    this._subscriptionRotate = Dimension.onChange().subscribe(value => {
      if (this.state.dimension !== value) {
        // @ts-ignore
        this.setState({
          dimension: value,
        })
      }
    })
  }

  setSampleData = (sample: Sample, imageData: string[] = []) => {
    if (sample && sample.isValid()) {
      clearTimeout(this._timer)

      // update safe sample
      this._safeSample.sample = sample

      const { convertSampleToObject } = this._safeSample

      sampleNavigation.setData(SampleData.Sample, convertSampleToObject)

      this.setState({
        imageData,
        sample: convertSampleToObject,
        loading: false,
      })

      // update data sample in SampleInfoDetailForm
      updateSampleInfo.next(convertSampleToObject)
    } else {
      this.setState({
        loading: true,
      })

      const { asComponent, selectedIndex } = this.props
      if (asComponent && isIpad()) {
        sampleStore.delete().next({
          index: selectedIndex,
        })
      } else {
        this.onShowAlert()
      }
    }
  }

  onShowAlert = () => {
    sampleNavigation.closeAllModal()

    if (!this._isDeletedByMyself) {
      CustomAlert.error({
        message: I18n.t('thisSampleWasDeleted'),
        onPress: () => {
          this.props.navigation.goBack()
        },
      })
    }
  }

  onDelete = () => {
    const { sampleFactory, navigation, asComponent, selectedIndex } = this.props
    const { sample } = this.state

    sampleFactory
      .update(sample.id, {
        deleted: true,
      })
      .subscribe(() => {
        onDeleteSample.next()
        if (asComponent && isIpad()) {
          sampleStore.delete().next({
            index: selectedIndex,
          })
        } else {
          this._isDeletedByMyself = true
          setTimeout(() => {
            navigation.goBack()
          }, 10)
        }
      })
  }

  onChangeHeaderVisibility = (state: boolean) => {
    this.setState({
      headerVisible: state,
    })

    if (!this.props.asComponent) {
      const barStyle = state ? 'light-content' : 'dark-content'
      StatusBar.setBarStyle(barStyle, true)
    }
  }

  onPressIconLeft = () => {
    this.setState({
      isBack: true,
    })

    this.props.navigation.goBack()
  }

  onComment = (text: string, cb: (clear: boolean) => void) => {
    const { sampleFactory, commentFactory } = this.props
    const { sample } = this.state
    if (!sample) {
      return
    }

    commentFactory.create({ text }).subscribe(
      comment => {
        sampleFactory.comment(sample.id, comment).subscribe(newSample => {
          cb && cb(true)
          if (newSample) {
            this.setState({ sample: newSample })
          }
          onItemCreated.next({
            sample,
            type: 'comment',
            commentType: 'sample',
            id: comment.id,
          })
        })
      },
      err => {
        console.warn('Error creating comment', err)
      }
    )
  }

  onCommentInputFocus = (isFocused: boolean) => {
    this.setState({ disableActionBar: isFocused })
  }

  renderBackground = () => {
    const { sample, imageData } = this.state
    const { navigation, wasCreated: _wasCreated, layoutWidth } = this.props
    const wasCreated = navigation.getParam('wasCreated', _wasCreated)

    return (
      <SampleInfoImage
        layoutWidth={layoutWidth}
        sample={sample}
        imageData={imageData}
        wasCreated={wasCreated}
      />
    )
  }

  setKeyboardIsShowUp = (keyboardIsShowUp: boolean) => {
    this.setState({ keyboardIsShowUp })
  }

  render() {
    const { loading, isBack } = this.state
    const { layoutWidth, asComponent } = this.props
    const headerHeight = layoutWidth
      ? layoutWidth
      : Dimensions.get('screen').width

    if (loading) {
      return <AIndicator full />
    }
    const sample = this.props.navigation.getParam('sample', {} as any)
    const safeSample = new SafeSample(sample)
    return (
      <SampleInfoContext.Provider
        value={{
          sample,
          safeSample,
          isBack,
          asComponent,
          onDelete: this.onDelete,
          headerVisible: this.isActiveHeader,
          onPressIconLeft: this.onPressIconLeft,
          onSend: this.onComment,
          onCommentInputFocus: this.onCommentInputFocus,
        }}
      >
        <View style={styles.container}>
          <SampleInfoContent
            renderBackground={this.renderBackground}
            onChangeHeaderVisibility={this.onChangeHeaderVisibility}
            headerHeight={headerHeight}
          />
        </View>
        <SampleInfoActionBar
          setKeyboardIsShowUp={this.setKeyboardIsShowUp}
          disable={this.state.disableActionBar}
        />
      </SampleInfoContext.Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: isIphoneX() ? 34 : 0,
    backgroundColor: 'white',
  },
})
