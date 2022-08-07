import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { Product, Tag } from '@/models/team'
import { ProductInfoHeaderStatus } from '@/screens/ProductInfo/Components/ProductInfoHeaderStatus'
import { ProductInfoContext } from '@/screens/ProductInfo/ProductInfoContext'
import { withContext } from '@/shared/withContext'
import { colors, metrics, images } from '@/vars'
import * as React from 'react'
import { Keyboard, StyleSheet, View } from 'react-native'
import { ProductInfoHeaderAction } from './ProductInfoHeaderAction'
import { ProductInfoHeaderNumberPicture } from './ProductInfoHeaderNumberPicture'
import { ProductInfoHeaderTitle } from './ProductInfoHeaderTitle'
import { ADataRow } from '@/components/ADataRow/ADataRow'
import {
  ProductData,
  productNavigation,
  ProductRef,
} from '@/navigation/productNavigation'
import { ADataText } from '@/components/ADataText/ADataText'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import I18n from '@/i18n'
import { SafeProduct } from '@/shared/product'
import { selectPlatform } from '@/shared/devices'

type Props = {
  product?: Product
  safeProduct?: SafeProduct
  reachedTab?: boolean
} & AppContextState

export type State = Readonly<{
  descriptionKey: number
}>

@DelayRender()
@withContext(AppContext.Consumer)
@withContext(ProductInfoContext.Consumer)
export class ProductInfoHeader extends React.PureComponent<Props, State> {
  readonly state: State = {
    descriptionKey: 0,
  }

  constructor(props) {
    super(props)
    productNavigation.setData(
      ProductData.DescriptionOnSave,
      this.onSaveDescription
    )
  }

  onPressHeader = modal => () => {
    productNavigation.open(modal)
  }

  openTextEditor = () => {
    productNavigation.open(ProductRef.Description)
  }

  onSaveDescription = (description: string, isMoveDown: boolean = false) => {
    const { productFactory, product } = this.props

    productFactory
      .update(product.id, {
        description,
      })
      .subscribe(prod => {
        if (prod) {
          productNavigation.setData(ProductData.Product, prod)
        }
        Keyboard.dismiss()
        !isMoveDown && productNavigation.close(ProductRef.Description)
        this.updateDescriptionKey()
      })
  }

  updateDescriptionKey = () => {
    this.setState((prevState: State) => {
      return {
        descriptionKey: prevState.descriptionKey + 1,
      }
    })
  }

  render() {
    const { safeProduct, reachedTab } = this.props
    const { description, tags, projects } = safeProduct

    return (
      <View style={[styles.container, reachedTab && styles.marginBottomCustom]}>
        <ProductInfoHeaderNumberPicture />
        <ProductInfoHeaderStatus />
        <ProductInfoHeaderTitle />
        <ProductInfoHeaderAction />

        <ADataText
          onOpen={this.openTextEditor}
          description={description && description}
          descriptionKey={this.state.descriptionKey}
        />

        <ADataRow<Tag>
          data={tags}
          onPressHeader={this.onPressHeader(ProductRef.SelectTags)}
        />

        <ADataRow
          label={I18n.t('projects')}
          description={I18n.t('noProjectsYet')}
          headerIcon={images.project}
          data={projects}
          onPressHeader={this.onPressHeader(ProductRef.SelectProjects)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.medium_base,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: -8,
    paddingBottom: 24,
  },
  marginBottomCustom: {
    marginBottom: -metrics.tab_view_3_height,
  },
})
