import * as React from 'react'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { Sample } from '@/models/team'
import { SampleInfoHeaderStatus } from '@/screens/SampleInfo/Components/SampleInfoHeaderStatus'
import { SampleInfoContext } from '@/screens/SampleInfo/SampleInfoContext'
import { withContext } from '@/shared/withContext'
import { colors, metrics } from '@/vars'
import { Keyboard, StyleSheet, View } from 'react-native'
import { SampleInfoHeaderAction } from './SampleInfoHeaderAction'
import { SampleInfoHeaderTitle } from './SampleInfoHeaderTitle'
import {
  SampleData,
  sampleNavigation,
  SampleRef,
} from '@/navigation/sampleNavigation'
import I18n from '@/i18n'
import { ADataText } from '@/components/ADataText/ADataText'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { SafeSample } from '@/shared/sample'
import { isEmpty } from 'lodash'
import { withNavigation } from 'react-navigation'
import { isIpad } from '@/shared/devices'
import { productStore } from '@/stores/productStore'
import { supplierStore } from '@/stores/supplierStore'
import { Direction } from '@/common/constants/Direction'

type Props = {
  sample?: Sample
  safeSample?: SafeSample
  reachedTab?: boolean
} & AppContextState

export type State = Readonly<{
  descriptionKey: number
}>

@DelayRender()
@withContext(AppContext.Consumer)
@withContext(SampleInfoContext.Consumer)
@(withNavigation as any)
export class SampleInfoHeader extends React.PureComponent<Props, State> {
  readonly state: State = {
    descriptionKey: 0,
  }

  constructor(props) {
    super(props)
    sampleNavigation.setData(
      SampleData.DescriptionOnSave,
      this.onSaveDescription
    )
  }

  openTextEditor = () => {
    sampleNavigation.open(SampleRef.Description)
  }

  onSaveDescription = (
    description: string,
    isMoveDown: boolean = false,
    direction: Direction
  ) => {
    const { sampleFactory, sample } = this.props

    sampleFactory
      .update(sample.id, {
        description,
      })
      .subscribe(() => {
        Keyboard.dismiss()
        if (isMoveDown) {
          sampleNavigation.moveHandler(direction)
        } else {
          sampleNavigation.moveHandler(Direction.Up)
        }
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

  onSetValue = (data: any, key: string) => {
    const { sample, sampleFactory } = this.props
    if (!data || !sample) {
      return
    }
    const updateProps: any = {}
    if (key === 'supplier') {
      updateProps.supplier = data
    }
    if (key === 'product') {
      updateProps.product = data
    }
    if (isEmpty(updateProps)) {
      return
    }
    sampleFactory.update(sample.id, updateProps).subscribe(() => {})
  }

  onItemSelect = (type: string, action: 'view' | 'change') => {
    if (action === 'change') {
      const screenHeight = metrics.screen_height
      const marginTop = Math.round((screenHeight * 10) / 9) / 10
      const screenName =
        type === 'product' ? 'SelectProductPicker' : 'SelectSupplierPicker'
      this.props.navigation.navigate(screenName, {
        setValue: this.onSetValue,
        isCreateProduct: true,
        shouldNotSetProductRef: true,
        hideActionBar: true,
        modalProps: {
          height: screenHeight - marginTop,
          style: {
            marginTop,
          },
        },
      })
      return
    }
    if (action === 'view') {
      if (type === 'product') {
        this.onPressProductCard()
      } else if (type === 'supplier') {
        this.onPressSupplierCard()
      }
    }
  }

  onPressProductCard = () => {
    const { navigation, sample } = this.props
    if (!sample.product) {
      return
    }

    if (!isIpad()) {
      navigation.push('ProductInfoScreen', {
        productName: sample.product.name,
        productId: sample.product.id,
        wasCreated: true,
      })
    } else {
      productStore.select().next({
        item: sample.product,
        index: 0,
      })
    }
  }

  onPressSupplierCard = () => {
    const { navigation, sample } = this.props
    if (!sample.supplier) {
      return
    }
    if (!isIpad()) {
      navigation.push('SupplierInfoScreen', {
        supplierId: sample.supplier.id,
      })
    } else {
      supplierStore.select().next({
        item: sample.supplier,
        index: 0,
      })
    }
  }

  render() {
    const { safeSample, reachedTab } = this.props
    const { description } = safeSample

    return (
      <View style={[styles.container, reachedTab && styles.marginBottomCustom]}>
        <SampleInfoHeaderStatus />
        <SampleInfoHeaderTitle onItemSelect={this.onItemSelect} />
        <SampleInfoHeaderAction />

        <ADataText
          onOpen={this.openTextEditor}
          description={description && description}
          descriptionKey={this.state.descriptionKey}
          viewMoreText={I18n.t('viewMore')}
          viewLessText={I18n.t('taskViewLess')}
          viewMoreTextContainerStyle={styles.transparent}
          viewMoreTextStyle={styles.text}
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
  transparent: {
    backgroundColor: 'transparent',
  },
  text: {
    color: colors.primary_blue,
  },
  marginBottomCustom: {
    marginBottom: -metrics.tab_view_3_height,
  },
})
