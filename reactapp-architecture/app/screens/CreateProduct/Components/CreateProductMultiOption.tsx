import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { withContext } from '@/shared/withContext'
import { CreateProductContext } from '@/screens/CreateProduct/CreateProductContext'
import { colors, fonts } from '@/vars'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { AButton } from '@/components/AButton/AButton'
import I18n from '@/i18n'
import { CreateType } from '@/screens/CreateProduct/CreateProductScreen'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  image?: []
  setValue?: any
  createType?: CreateType
} & DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState>

@withContext(CreateProductContext.Consumer)
@withContext(AppContext.Consumer)
export class CreateProductMultiOption extends React.PureComponent<
  Props,
  State
> {
  _numberImages: number = 0

  readonly state: State = initialState

  componentDidUpdate() {
    const { image } = this.props
    this._numberImages = image.length
  }

  chooseCreateStyle = (type: CreateType) => () => {
    const { setValue } = this.props
    setValue && setValue(type, 'createType')
  }

  get isCreateMulti() {
    const { createType } = this.props
    return createType === CreateType.Multi
  }

  get buttonDescriptionTitle() {
    return this.isCreateMulti
      ? I18n.t('youCreatingNumberProducts', {
          number: this.props.image.length,
        })
      : I18n.t('youCreatingOneProduct')
  }

  get buttonDescription() {
    return this.isCreateMulti
      ? I18n.t('youCreatingNumberProductsDescription')
      : I18n.t('youCreatingOneProductDescription')
  }

  get renderButtonDescription() {
    return (
      <View style={styles.wrapButtonDescription}>
        <Text style={styles.descriptionTitle}>
          {this.buttonDescriptionTitle}
        </Text>

        <Text style={styles.description}>{this.buttonDescription}</Text>
      </View>
    )
  }

  get renderButtonMulti() {
    const multiProduct = I18n.t('createNumberProducts', {
      number: this.props.image.length,
    })

    return (
      <AButton
        onPress={this.chooseCreateStyle(CreateType.Multi)}
        title={multiProduct}
        containerStyle={[
          styles.buttonContainer,
          !this.isCreateMulti && { backgroundColor: colors.background_gray },
        ]}
        titleStyle={[
          styles.buttonText,
          !this.isCreateMulti && { color: colors.dark_blue_grey },
        ]}
      />
    )
  }

  get renderButtonSingle() {
    return (
      <AButton
        onPress={this.chooseCreateStyle(CreateType.Single)}
        title={I18n.t('createOneProduct')}
        containerStyle={[
          styles.buttonContainer,
          this.isCreateMulti && { backgroundColor: colors.background_gray },
        ]}
        titleStyle={[
          styles.buttonText,
          this.isCreateMulti && { color: colors.dark_blue_grey },
        ]}
      />
    )
  }

  get renderButton() {
    return (
      <View style={styles.wrapButton}>
        {this.renderButtonMulti}
        {this.renderButtonSingle}
      </View>
    )
  }

  render() {
    if (this.props.image.length <= 1) return null

    return (
      <>
        {this.renderButton}
        {this.renderButtonDescription}
      </>
    )
  }
}

const styles = StyleSheet.create<any>({
  numberText: {
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
  },
  wrapButton: {
    flexDirection: 'row',
    marginTop: 12,
    marginHorizontal: 12,
  },
  buttonContainer: {
    height: 40,
    flex: 1,
    margin: 0,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: fonts.size.m,
  },
  wrapButtonDescription: {
    marginTop: 15,
  },
  descriptionTitle: {
    textAlign: 'center',
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
  },
  description: {
    textAlign: 'center',
    color: colors.black_blue_text,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.s,
  },
})
