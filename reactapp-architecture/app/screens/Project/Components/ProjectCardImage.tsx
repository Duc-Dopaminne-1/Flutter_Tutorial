import * as React from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { withNavigation } from 'react-navigation'
import { colors, fonts, images, metrics } from '@/vars'
import I18n from '@/i18n'
import { LImage } from '@/libs/LImage'
import { ImageState } from './ProjectCard'

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  productImages: {
    id: string
    uri: string
    state: string
  }[]
  onPressAddProduct: () => void
}> &
  DefaultProps

export type State = Partial<{}>

@(withNavigation as any)
export class ProjectCardImage extends React.PureComponent<Props, State> {
  readonly state: State = {}

  renderEmptyImage = (state: string) => {
    const isAddProduct = state === ImageState.AddProduct

    return (
      <View style={styles.wrapImage}>
        <Image source={images.placeHolderProject} style={styles.image} />
        {isAddProduct && (
          <View style={styles.wrapAddText}>
            <Text style={styles.AddText}>{I18n.t('addProduct')}</Text>
          </View>
        )}
      </View>
    )
  }

  renderItem = ({ item }) => {
    const { state, id, uri } = item

    if (state === ImageState.NoImage) {
      return this.renderEmptyImage(state)
    }
    if (state === ImageState.AddProduct) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onPressAddProduct}
        >
          {this.renderEmptyImage(state)}
        </TouchableOpacity>
      )
    }

    return (
      <View style={styles.wrapImage}>
        <LImage
          source={{
            id,
            uri,
            downsampling: 200,
          }}
          style={styles.image}
          scaleMode={'scaleAspectFill'}
        />
      </View>
    )
  }

  render() {
    const { productImages } = this.props

    return (
      <FlatList
        data={productImages}
        extraData={productImages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={this.renderItem}
        numColumns={3}
        scrollEnabled={false}
      />
    )
  }
}

const styles = StyleSheet.create<any>({
  wrapImage: {
    margin: 5,
    overflow: 'hidden',
    height: metrics.screen_width / 3.55,
    width: metrics.screen_width / 3.45,
  },
  image: {
    height: metrics.screen_width / 3.55,
    width: metrics.screen_width / 3.55,
  },
  wrapAddText: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  AddText: {
    textAlign: 'center',
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
    color: colors.light_blue_grey,
  },
})
