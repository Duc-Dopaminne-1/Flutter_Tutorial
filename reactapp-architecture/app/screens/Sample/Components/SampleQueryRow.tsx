import * as React from 'react'
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  ImageSourcePropType,
  Platform,
} from 'react-native'
import Swipeable from 'react-native-swipeable-row'
import { Sample } from '@/models/team'
import { NavigationInjectedProps } from 'react-navigation'
import { colors, fonts, metrics, images } from '@/vars'
import { Subscription } from 'rxjs'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { CacheResult } from '@/locals/models/cache-result'
import { LImage } from '@/libs/LImage'
import { SafeProduct } from '@/shared/product'
import { SafeSample } from '@/shared/sample'
import { SafeSupplier } from '@/shared/supplier'

type Props = {
  sample: Sample
  onPress: (sample: Sample) => void
  onAction: (sample: Sample, type: SampleActionType) => void
  disableSwipeActions?: boolean
  onRowSwipe?: (isOpened: boolean, id: string) => void
  setRef?: (ref: any) => void
} & Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{
  uris: Image[]
  sample: Sample | null
  selected: boolean
}>

export type SampleActionType = 'reAssign' | 'delete'

type RightButton = {
  text: string
  image: ImageSourcePropType
  backgroundColor: string
  index: number
}

@withContext(AppContext.Consumer)
export class SampleQueryRow extends React.PureComponent<Props, State> {
  _subscription: Subscription | undefined
  _supplierChangeSubscription: Subscription | undefined
  _results: Realm.Results<Sample> | undefined
  _imageResults: Realm.Results<CacheResult> | undefined
  _imageSubscription: Subscription | undefined
  _latestChange = false
  _rightButtons: React.ReactNodeArray = []
  _swipableRef?: any = React.createRef()

  static readonly defaultProps = {
    modifications: [],
    onAction: Function.prototype,
    onRowSwipe: Function.prototype,
    setRef: Function.prototype,
  }

  readonly state: State = {
    uris: [] as any,
    sample: null,
    selected: false,
  }

  constructor(props: Props) {
    super(props)
    this._rightButtons = [
      {
        text: 'Assign',
        image: images.user,
        backgroundColor: colors.primary_blue,
      },
      { text: 'Delete', image: images.trash, backgroundColor: colors.warning },
    ].map((item, index) => this.renderSwipableContent({ ...item, index }))
  }

  componentDidMount(): void {
    this.props.setRef(this._swipableRef)
  }

  componentWillUnmount(): void {}

  renderImage = () => {
    const { sample = {} as any } = this.props
    const {
      images: { uri, first },
    } = new SafeSample(sample)

    if (!uri && !first.id) {
      return (
        <View style={styles.placeholderImageContainer}>
          <Image source={images.sample} style={styles.placeholderImage} />
        </View>
      )
    }
    return (
      <View style={styles.thumbnailContainer}>
        <LImage
          source={{
            uri,
            id: first.id,
          }}
          style={styles.thumbnail}
        />
      </View>
    )
  }

  onRightActionPress = (action: RightButton) => {
    let sampleActionType: SampleActionType
    switch (action.index) {
      case 0:
        sampleActionType = 'reAssign'
        break
      case 1:
        sampleActionType = 'delete'
        break
    }
    this.props.onAction(this.props.sample, sampleActionType)
    this.closeRow()
  }

  closeRow = () => {
    if (this._swipableRef && this._swipableRef.recenter) {
      this._swipableRef.recenter()
    }
  }

  renderSwipableContent = (content: RightButton) => {
    const { text, image, backgroundColor } = content
    return (
      <TouchableHighlight
        style={{ backgroundColor }}
        onPress={() => this.onRightActionPress(content)}
      >
        <View style={[styles.swipableContent, { backgroundColor }]}>
          <Image style={styles.rightIcon} source={image} />
          <Text numberOfLines={1} style={styles.rightButtonText}>
            {text}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  renderLinks = () => {
    const { sample = {} as any } = this.props
    if (!sample.product && !sample.supplier) {
      return null
    }
    const { name: supplierName } = new SafeSupplier(sample.supplier)
    const { name: productName } = new SafeProduct(sample.product)

    return (
      <View style={styles.links}>
        {!sample.product ? null : (
          <View style={styles.rowCenter}>
            <View style={styles.iconProductContainer}>
              <Image style={styles.iconProduct} source={images.product} />
            </View>
            <Text numberOfLines={1} style={styles.detail}>
              {productName}
            </Text>
          </View>
        )}
        {!sample.supplier ? null : (
          <View style={styles.rowCenter}>
            <View style={styles.iconSupplierContainer}>
              <Image style={styles.iconSupplier} source={images.company} />
            </View>
            <Text numberOfLines={1} style={styles.detail}>
              {supplierName}
            </Text>
          </View>
        )}
      </View>
    )
  }

  renderStatus = () => {
    const { sample } = this.props
    const safeSample = new SafeSample(sample)
    const { formattedLabel, color, background, step } = safeSample.safeStatus
    const name = `${step ? step + '. ' : ''}${formattedLabel}`

    return (
      <View style={[styles.statusContainer, { backgroundColor: background }]}>
        <Text style={[styles.status, { color }]}>{name}</Text>
      </View>
    )
  }

  onRowPress = () => {
    const { onPress, sample } = this.props
    this.setState({ selected: true }, () => {
      setTimeout(() => {
        this.setState({ selected: false })
      }, 1000)
    })
    onPress(sample)
  }

  render() {
    const { sample, disableSwipeActions, onRowSwipe } = this.props
    const { selected } = this.state

    const { assignedName, commentsCount } = new SafeSample(sample)
    const assigned =
      assignedName +
      (commentsCount ? `${assignedName ? ' | ' : ''}${commentsCount}` : '')

    return (
      <Swipeable
        onRef={ref => (this._swipableRef = ref)}
        rightButtons={this._rightButtons}
        rightButtonWidth={80}
        disable={disableSwipeActions}
        onRightButtonsCloseRelease={() => onRowSwipe(false, sample.id)}
        onRightButtonsOpenRelease={() => onRowSwipe(true, sample.id)}
      >
        <TouchableHighlight
          style={styles.wrapItem}
          onPress={this.onRowPress}
          activeOpacity={0.01}
          underlayColor={colors.light_grey}
        >
          <View />
        </TouchableHighlight>
        <View
          pointerEvents="none"
          style={[
            styles.wrapContainer,
            selected && styles.wrapContainerSelected,
          ]}
        >
          {this.renderImage()}
          <View style={styles.texts}>
            <Text numberOfLines={1} style={styles.sampleName}>
              {sample.reference}
            </Text>
            {this.renderLinks()}
            <View style={styles.assigneeContainer}>
              <Text numberOfLines={1} style={styles.sampleAssagnee}>
                {assigned}
              </Text>
            </View>
          </View>
          {this.renderStatus()}
        </View>
        <View style={styles.bottomBorder} />
      </Swipeable>
    )
  }
}

const styles = StyleSheet.create<any>({
  assigneeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detail: {
    color: colors.black_blue_text,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.m,
    marginLeft: 8,
    minHeight: 18,
  },
  wrapContainer: {
    flex: 1,
    minHeight: metrics.sample_row_height,
    paddingVertical: 12,
    paddingRight: 13,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.transparent,
  },
  wrapContainerSelected: {
    backgroundColor: colors.light_grey,
  },
  check: {
    width: metrics.tasks_check_icon_size,
    height: metrics.tasks_check_icon_size,
    resizeMode: 'contain',
    marginHorizontal: 12,
  },
  wrapItem: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bottomBorder: {
    height: 1,
    backgroundColor: colors.pale_grey,
    left: 12,
    right: 0,
    position: 'absolute',
    bottom: 0,
  },
  sampleName: {
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xl,
  },
  sampleAssagnee: {
    color: colors.text_light_grey,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.s,
  },
  texts: {
    flex: 1,
    paddingRight: 12,
  },
  thumbnailContainer: {
    width: metrics.sample_row_icon_size,
    height: metrics.sample_row_icon_size,
    borderRadius: metrics.prod_card_border_radius,
    marginRight: 12,
    marginLeft: 12,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  date: {
    color: colors.warning,
    fontSize: fonts.size.s,
    fontFamily: fonts.family.SSPSemiBold,
    marginRight: 12,
  },
  thumbnail: {
    width: metrics.sample_row_icon_size,
    height: metrics.sample_row_icon_size,
  },
  links: {
    paddingVertical: 5,
  },
  placeholderImage: {
    width: 20,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.wifi_unstable,
  },
  placeholderImageContainer: {
    width: metrics.sample_row_icon_size,
    height: metrics.sample_row_icon_size,
    borderRadius: metrics.prod_card_border_radius,
    marginRight: 12,
    marginLeft: 12,
    backgroundColor: colors.yellow_background,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  rightIcon: {
    width: 15,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.white,
    marginBottom: 2,
  },
  rightButtonText: {
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xs,
    width: '100%',
    textAlign: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swipableContent: {
    height: '100%',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inProgress: {
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: 8,
  },
  iconProductContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf6ff',
    borderRadius: 4,
    width: 12,
    height: 12,
  },
  iconProduct: {
    width: 8,
    height: 8,
    tintColor: colors.primary_blue,
  },
  iconSupplierContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffefff',
    borderRadius: 4,
    width: 12,
    height: 12,
  },
  iconSupplier: {
    width: 8,
    height: 8,
    tintColor: '#d97bff',
  },
  inProgressContainer: {
    backgroundColor: colors.pale_grey,
    paddingHorizontal: 3,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    ...Platform.select({
      ios: {
        marginTop: 1,
      },
    }),
  },
  statusContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  status: {
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPBold,
    fontSize: fonts.size.s,
    textAlign: 'center',
  },
})
