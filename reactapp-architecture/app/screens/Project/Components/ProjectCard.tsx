import * as React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { withNavigation } from 'react-navigation'
import { colors, fonts, images, metrics } from '@/vars'
import I18n from '@/i18n'
import { Product, Project } from '@/models/team'
import { SafeProject } from '@/shared/project'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { Subscription } from 'rxjs'
import { SafeProduct } from '@/shared/product'
import { ProjectCardImage } from '@/screens/Project/Components/ProjectCardImage'
import { AIndicator } from '@/components/AIndicator/AIndicator'

// default props
const defaultProps = {
  onOpenMenu: () => null,
}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  project: Project
  onPressItem: (item) => void
}> &
  AppContextState &
  DefaultProps

export type State = Partial<{
  productNumber: number
  products: any
  loading: boolean
}>

export const ImageState = {
  HasImage: 'HAS-IMAGE',
  NoImage: 'NO-IMAGE',
  AddProduct: 'ADD-PRODUCT',
}

const NUMBER_PRODUCT_DISPLAY = 6

@withContext(AppContext.Consumer)
@(withNavigation as any)
export class ProjectCard extends React.PureComponent<Props, State> {
  _subscription: Subscription
  _timeOutLoading: NodeJS.Timeout

  _results: Realm.Collection<Product> = [] as any

  readonly state: State = {
    productNumber: 0,
    products: Array(6).fill({
      id: '',
      uri: '',
      state: ImageState.NoImage,
    }),
    loading: true,
  }

  componentDidMount() {
    this.fetchProduct()
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._results && this._results.removeAllListeners()
    clearTimeout(this._timeOutLoading)
  }

  fetchProduct = () => {
    const { project, projectFactory } = this.props

    const [subscription, results] = projectFactory.fetchProductFromProject({
      project,
    })

    this._results = results

    this._subscription = subscription.subscribe(products => {
      if (products.length > 0) {
        this.initProductData(products)
      } else {
        this.initDefaultProductData()
      }

      this.setState({
        productNumber: products.length,
      })
    })
  }

  initDefaultProductData = () => {
    const createArray = Array(5).fill({
      id: '',
      uri: '',
      state: ImageState.NoImage,
    })
    const addImage = [{ id: '', uri: '', state: ImageState.AddProduct }]

    this.setState({
      products: addImage.concat(createArray),
    })
  }

  initProductData = (products: Realm.Results<Product>) => {
    const tempArray = []

    for (let i = 0; i < NUMBER_PRODUCT_DISPLAY; i++) {
      if (products[i]) {
        const {
          images: { uri, first },
        } = new SafeProduct(products[i])

        tempArray.push({
          uri,
          id: first.id,
          state: ImageState.HasImage,
        })
      } else if (products[i - 1] && !products[i]) {
        tempArray.push({
          id: '',
          uri: '',
          state: ImageState.AddProduct,
        })
      } else {
        tempArray.push({
          id: '',
          uri: '',
          state: ImageState.NoImage,
        })
      }
    }

    this.setState({
      products: tempArray,
    })
  }

  onPressAddProduct = () => {
    const { navigation, project } = this.props

    navigation.navigate('CameraScreen', {
      project: [project],
    })
  }

  get getProductNumber() {
    const { productNumber } = this.state

    if (productNumber > 1) {
      return productNumber + ' ' + I18n.t('products')
    }

    return productNumber + ' ' + I18n.t('product')
  }

  renderProjectImage = () => {
    const { products, loading } = this.state

    // if (loading) return <AIndicator />

    return (
      <ProjectCardImage
        productImages={products}
        onPressAddProduct={this.onPressAddProduct}
      />
    )
  }

  render() {
    const { project, onPressItem } = this.props
    const { name } = new SafeProject(project)
    const productNumber = this.getProductNumber

    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={() => {
          onPressItem(project)
        }}
      >
        <View style={styles.wrapHeader}>
          <View style={styles.wrapText}>
            <Text style={styles.title} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.description} numberOfLines={1}>
              {productNumber}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.wrapIcon}
            activeOpacity={0.8}
            onPress={this.props.onOpenMenu}
          >
            <Image
              source={images.more}
              style={styles.icon}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.wrapFlatList}>{this.renderProjectImage()}</View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    paddingTop: metrics.double_base,
  },
  wrapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: metrics.project_list_item_title_padding_horizontal,
  },
  wrapText: {
    flex: 15,
    paddingRight: metrics.double_base,
  },
  title: {
    fontFamily: fonts.family.SSPBold,
    fontSize: fonts.size.l,
    color: colors.dark_blue_grey,
  },
  description: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.m,
    color: colors.light_blue_grey,
    marginTop: 4,
  },
  wrapIcon: {
    flex: 1,
    padding: metrics.base,
  },
  icon: {
    height: metrics.project_list_item_icon_size,
    width: metrics.project_list_item_icon_size,
    tintColor: colors.text_category_type,
  },
  wrapFlatList: {
    alignItems: 'center',
  },
})
