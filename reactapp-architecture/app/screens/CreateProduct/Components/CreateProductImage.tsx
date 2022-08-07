import * as React from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native'
import { withContext } from '@/shared/withContext'
import { CreateProductContext } from '@/screens/CreateProduct/CreateProductContext'
import { colors, fonts, metrics, images } from '@/vars'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { Subscription } from 'rxjs'
import { imageStore3 } from '@/stores/imageStore3'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { LImage } from '@/libs/LImage'

type Props = {} & AppContextState

export type State = {
  images: string[]
}

const HIT_SLOP = { top: 10, right: 10, bottom: 10, left: 10 }

@withContext(CreateProductContext.Consumer)
@withContext(AppContext.Consumer)
export class CreateProductImage extends React.PureComponent<Props, State> {
  _subscription: Subscription
  _numberImages: number = 0

  readonly state: State = {
    images: [],
  }

  componentDidMount(): void {
    this._subscription = imageStore3.observerResult().subscribe(data => {
      this._numberImages = data.length
      this.setState({ images: data as any })
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
  }

  onRemoveImage = (id: string) => {
    if (this.state.images.length > 1) {
      imageStore3.removeById(id)
    }
  }

  renderItem = ({ item, index }) => {
    const id = item.id ? item.id : ''

    return (
      <>
        <LImage
          source={{
            id,
            uri: '',
          }}
          style={styles.imageStyle}
        />
        {index === 0 && this.renderNumberImages()}
        {this.renderTrashIcon(id)}
      </>
    )
  }

  renderTrashIcon = (id: string) => {
    if (this.state.images.length <= 1) {
      return null
    }
    return (
      <TouchableOpacity
        onPress={() => this.onRemoveImage(id)}
        style={styles.trashContainer}
        hitSlop={HIT_SLOP}
      >
        <Image source={images.trash} style={styles.trashIcon} />
      </TouchableOpacity>
    )
  }

  renderNumberImages = () => {
    if (this._numberImages === undefined || this._numberImages === null) {
      return null
    }
    if (this._numberImages <= 1) return null

    const isOverOnrHundred = this._numberImages > 99
    let displayNumber = this._numberImages.toString()

    if (isOverOnrHundred) {
      displayNumber = '99+'
    }

    return (
      <View
        style={[styles.wrapIcon, isOverOnrHundred && styles.updateSizeWrapIcon]}
      >
        <Text style={styles.numberText}>{displayNumber}</Text>
      </View>
    )
  }

  render() {
    const { images } = this.state

    return (
      <View style={styles.container}>
        <FlatList
          data={images}
          extraData={images}
          keyExtractor={(_item, index) => index.toString()}
          ListEmptyComponent={() => {
            return (
              <AIndicator
                containerStyle={[
                  styles.imageStyle,
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
              />
            )
          }}
          renderItem={this.renderItem}
          contentContainerStyle={styles.flatList}
          removeClippedSubviews={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    paddingTop: metrics.keylines_screen_edge_margin,
  },
  flatList: {
    paddingLeft: metrics.keylines_screen_edge_margin,
    paddingRight: metrics.keylines_screen_edge_margin - 4,
  },
  imageStyle: {
    height: 82,
    width: 82,
    marginRight: 4,
    overflow: 'hidden',
  },
  wrapIcon: {
    position: 'absolute',
    bottom: 3,
    left: 54,
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: colors.pink_red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateSizeWrapIcon: {
    bottom: 5,
    left: 46,
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  numberText: {
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
  },
  trashContainer: {
    position: 'absolute',
    left: 54,
    top: 4,
    width: 24,
    height: 24,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 6,
  },
  trashIcon: {
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'contain',
    tintColor: 'white',
  },
})
