import * as React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from 'react-native'
import I18n from '@/i18n'
import { SampleInfoContext } from '@/screens/SampleInfo/SampleInfoContext'
import { withContext } from '@/shared/withContext'
import { colors, fonts, metrics, images } from '@/vars'
import ActionSheet from 'react-native-actionsheet'
import { debounce } from 'lodash'
import { SafeSupplier } from '@/shared/supplier'
import { SafeSample } from '@/shared/sample'
import { Sample } from '@/models/team'
import { LImage } from '@/libs/LImage'
import { SafeProduct } from '@/shared/product'
import { SafeImage } from '@/shared/image'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  safeSample?: SafeSample
  sample?: Sample
  onItemSelect?: (type: string, action: 'view' | 'change') => void
} & DefaultProps

export type State = Readonly<typeof initialState>

@withContext(SampleInfoContext.Consumer)
export class SampleInfoHeaderTitle extends React.PureComponent<Props, State> {
  _actionSheet: React.RefObject<ActionSheet> = React.createRef()
  _actionSheetProduct: React.RefObject<ActionSheet> = React.createRef()
  readonly state: State = initialState

  onShowActionSheet = (type: 'product' | 'supplier') => {
    if (type === 'product') {
      this._actionSheetProduct.current.show()
    } else if (type === 'supplier') {
      this._actionSheet.current.show()
    }
  }

  onPress = debounce((index: number, type: 'supplier' | 'product') => {
    switch (index) {
      case 0:
        this.props.onItemSelect(type, 'view')
        return
      case 1:
        this.props.onItemSelect(type, 'change')
        return
      default:
        return
    }
  }, 100)

  renderImage = ({ uri, first }, type: string, empty: boolean = false) => {
    if (!uri) {
      if (type === 'product') {
        return (
          <View
            style={[
              styles.iconProductContainer,
              empty && styles.emptyImageContainer,
            ]}
          >
            <Image
              style={[styles.iconLink, empty && styles.emptyImage]}
              source={images.product}
            />
          </View>
        )
      }
      return (
        <View
          style={[
            styles.iconSupplierContainer,
            empty && styles.emptyImageContainer,
          ]}
        >
          <Image
            style={[styles.iconLink, empty && styles.emptyImage]}
            source={images.company}
          />
        </View>
      )
    }
    return (
      <View style={styles.thumbnail}>
        <LImage
          source={{
            uri,
            id: first.id,
            downsampling: 200,
          }}
          style={styles.thumbnail}
        />
      </View>
    )
  }

  renderLinkedProduct = () => {
    const { sample } = this.props
    if (!sample.product) {
      return this.renderEmptyProduct(
        I18n.t('select'),
        I18n.t('product'),
        'product'
      )
    }

    const { images, reference, name } = new SafeProduct(sample.product)
    const ref = `${I18n.t('linkedToProduct')}${
      reference ? ' / ' + reference : ''
    }`

    return (
      <TouchableHighlight
        onPress={() => this.onShowActionSheet('product')}
        underlayColor={colors.background}
        style={[styles.linkedItemContainer, styles.linkedItemContainerProduct]}
      >
        <View style={styles.linkedItemWrap}>
          {this.renderImage(images, 'product')}
          <View style={styles.linkedItem}>
            <Text style={styles.sectionTitle}>{ref}</Text>
            <Text style={styles.changeText}>{name}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  renderLinkedSupplier = () => {
    const { sample } = this.props
    if (!sample.supplier) {
      return this.renderEmptyProduct(
        I18n.t('select'),
        I18n.t('supplier'),
        'supplier'
      )
    }

    const { reference, name, logoImage } = new SafeSupplier(sample.supplier)
    const { uri, id } = new SafeImage(logoImage.uri)
    const ref = `${I18n.t('linkedToSupplier')}${
      reference ? ' / ' + reference : ''
    }`

    return (
      <TouchableHighlight
        style={styles.linkedItemContainer}
        underlayColor={colors.background}
        onPress={() => this.onShowActionSheet('supplier')}
      >
        <View style={styles.linkedItemWrap}>
          {this.renderImage({ uri, first: { id } }, 'supplier')}
          <View style={styles.linkedItem}>
            <Text style={styles.sectionTitle}>{ref}</Text>
            <Text style={styles.changeText}>{name}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  onSelectLinkedItem = (type: 'product' | 'supplier') => {
    this.props.onItemSelect(type, 'change')
  }

  renderEmptyProduct = (
    title: string,
    message: string,
    type: 'product' | 'supplier'
  ) => {
    return (
      <TouchableOpacity
        style={[
          styles.emptyItemContainer,
          type === 'product' && { marginBottom: 24 },
        ]}
        onPress={() => this.onSelectLinkedItem(type)}
      >
        {this.renderImage({ uri: null, first: {} }, type, true)}
        <View style={styles.linkedItem}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.changeText}>{message}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { name, reference } = this.props.safeSample

    return (
      <View style={styles.container}>
        <Text style={styles.referenceText} numberOfLines={2}>
          {reference}
        </Text>
        <Text style={styles.titleText} numberOfLines={2}>
          {name}
        </Text>
        {this.renderLinkedSupplier()}
        {this.renderLinkedProduct()}
        <ActionSheet
          ref={this._actionSheet}
          title={I18n.t('more').capitalize()}
          options={[
            I18n.t('viewSupplier'),
            I18n.t('changeSupplier'),
            I18n.t('cancel'),
          ]}
          cancelButtonIndex={2}
          onPress={index => this.onPress(index, 'supplier')}
        />
        <ActionSheet
          ref={this._actionSheetProduct}
          title={I18n.t('more').capitalize()}
          options={[
            I18n.t('viewProduct'),
            I18n.t('changeProduct'),
            I18n.t('cancel'),
          ]}
          cancelButtonIndex={2}
          onPress={index => this.onPress(index, 'product')}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    backgroundColor: colors.white,
  },
  productEmpty: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.xl,
    color: colors.light_blue_grey,
  },
  productSelectButton: {
    backgroundColor: '#e9edf5',
    borderRadius: 5,
    paddingHorizontal: 30,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  referenceText: {
    fontSize: fonts.size.xxl,
    fontFamily: fonts.family.SSPSemiBold,
    marginTop: metrics.base,
    color: colors.black,
  },
  titleText: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    marginTop: 4,
    color: colors.black_blue_text,
  },
  wrapPriceAndMOQ: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceText: {
    color: colors.primary_blue,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.xxxl,
    marginRight: metrics.base,
  },
  minText: {
    color: colors.text_light_grey,
    fontSize: fonts.size.l,
    marginBottom: 3,
    alignSelf: 'flex-end',
  },
  wrapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.base,
    paddingRight: metrics.keylines_screen_edge_margin,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapIcon: {
    height: 17,
    width: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginRight: metrics.base,
  },
  icon: {
    height: 10,
    width: 10,
    tintColor: colors.white,
  },
  text: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.blue_light_grey,
  },
  linkedItemWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  emptyItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 7,
    marginTop: 12,
    backgroundColor: '#f9fafc',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e6ebf5',
    borderStyle: 'dashed',
  },
  linkedItemContainer: {
    paddingVertical: 10,
    marginTop: 8,
    borderRadius: 4,
  },
  linkedItemContainerProduct: {
    marginBottom: 24,
  },
  linkedItem: {
    paddingLeft: 8,
    paddingRight: 17,
    justifyContent: 'space-between',
    width: '100%',
  },
  sectionTitle: {
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.s,
    width: '100%',
    paddingRight: 17,
  },
  changeText: {
    color: colors.black_blue_text,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
    paddingRight: 17,
    width: '100%',
  },
  emptyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  thumbnail: {
    width: metrics.tasks_product_image_size,
    height: metrics.tasks_product_image_size,
    borderRadius: metrics.prod_card_border_radius,
    overflow: 'hidden',
    resizeMode: 'contain',
  },
  iconProductContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45adff',
    width: metrics.tasks_product_image_size,
    height: metrics.tasks_product_image_size,
    borderRadius: metrics.prod_card_border_radius,
  },
  iconSupplierContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d97bff',
    width: metrics.tasks_product_image_size,
    height: metrics.tasks_product_image_size,
    borderRadius: metrics.prod_card_border_radius,
  },
  iconLink: {
    width: 20,
    height: 20,
    tintColor: colors.white,
  },
  emptyImageContainer: {
    backgroundColor: colors.close_icon_gray,
  },
  emptyImage: {
    tintColor: colors.light_blue_grey,
  },
})
