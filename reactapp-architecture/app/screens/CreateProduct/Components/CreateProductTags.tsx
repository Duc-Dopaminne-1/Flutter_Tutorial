import * as React from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { withContext } from '@/shared/withContext'
import { CreateProductContext } from '@/screens/CreateProduct/CreateProductContext'
import { colors, fonts, images, metrics } from '@/vars'
import I18n from '@/i18n'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { ADataRowEmpty } from '@/components/ADataRow/ADataRowEmpty'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  tags?: []
  openModal?: (key) => void
} & DefaultProps

export type State = Readonly<typeof initialState>

@withContext(CreateProductContext.Consumer)
export class CreateProductTags extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  openModal = () => {
    createProductNavigation.open(CreateProductRef.SelectTags)
  }

  get hasData() {
    return this.props.tags.length > 0
  }

  renderItem = ({ item }) => {
    const tagName = item ? item.name : ''

    return (
      <View style={styles.wrapTag}>
        <Text style={styles.tagText}>{tagName.toUpperCase()}</Text>
      </View>
    )
  }

  renderHeader = () => {
    return (
      <TouchableOpacity style={styles.wrapIcon} onPress={this.openModal}>
        <Image
          source={images.tags}
          resizeMode={'contain'}
          style={styles.icon}
        />
      </TouchableOpacity>
    )
  }

  render() {
    const { tags } = this.props

    if (!this.hasData) {
      return (
        <ADataRowEmpty
          title={I18n.t('tags')}
          description={I18n.t('noTagsYet')}
          onPress={this.openModal}
          containerStyle={{ paddingTop: 24, paddingHorizontal: 12 }}
        />
      )
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('tags')}</Text>

        <FlatList
          data={tags}
          extraData={tags}
          keyExtractor={(_, index) => index.toString()}
          renderItem={this.renderItem}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          ListHeaderComponent={this.renderHeader}
          contentContainerStyle={styles.flatList}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    paddingTop: 24,
  },
  title: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
    marginLeft: metrics.keylines_screen_edge_margin,
    marginBottom: 12,
  },
  flatList: {
    alignItems: 'center',
    paddingLeft: metrics.keylines_screen_edge_margin,
    paddingRight: metrics.keylines_screen_edge_margin,
  },
  wrapTag: {
    marginRight: metrics.small_base,
    borderColor: colors.border_gray,
    borderWidth: 1,
    borderRadius: metrics.double_base,
    padding: 8,
  },
  tagText: {
    color: colors.text_grey,
    fontSize: fonts.size.s,
    fontFamily: fonts.family.SSPBold,
  },
  wrapIcon: {
    marginRight: metrics.small_base,
    borderColor: colors.border_gray,
    borderWidth: 1,
    borderRadius: metrics.double_base,
    padding: 7,
  },
  icon: {
    tintColor: colors.black,
    height: 16,
    width: 16,
  },
})
