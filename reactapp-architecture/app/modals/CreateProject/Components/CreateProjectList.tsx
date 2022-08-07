import { AButtonCreate } from '@/components/AButton/AButtonCreate'
import I18n from '@/i18n'
import { Project, Supplier } from '@/models/team'
import { ifIphoneX } from '@/shared/devices'
import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { CreateProjectPlaceholder } from '@/modals/CreateProject/Components/CreateProjectPlaceholder'
import { SafeProject } from '@/shared/project'

type Props = {
  keyword: string
  onCreate: (keyword: string) => void
  onSelect: (project: Project) => void
  data: Realm.Results<Supplier>
  isPerfect: boolean
  dirty: boolean
}

export class CreateProjectList extends React.PureComponent<Props> {
  static readonly defaultProps = {
    data: [],
  }

  get isEmpty() {
    return !!this.props.data.length
  }

  onSelect = (project: Project) => {
    this.props.onSelect(project)
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          this.onSelect(item)
        }}
      >
        <View style={styles.wrapImage}>
          <Image source={images.project} style={styles.image} />
        </View>

        <View style={styles.wrapButtonTitle}>
          <Text style={styles.buttonTitle} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderHeader = () => {
    const { keyword, onCreate, isPerfect } = this.props
    return (
      <View style={{ paddingTop: metrics.base, backgroundColor: colors.white }}>
        {!isPerfect && (
          <AButtonCreate
            text={keyword}
            onPress={() => onCreate(keyword)}
            containerStyle={{ marginBottom: metrics.base }}
          />
        )}
        {this.isEmpty && (
          <View style={styles.headerContainer}>
            <Text style={styles.headerLabel}>
              {I18n.t('projectWithSimilarName').toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    )
  }

  render() {
    const { data, dirty } = this.props

    if (!dirty) {
      return <CreateProjectPlaceholder />
    }

    return (
      <>
        {this.renderHeader()}
        <FlatList<Supplier>
          data={data}
          extraData={data}
          renderItem={this.renderItem}
          keyExtractor={_item => _item.id}
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={'always'}
          style={styles.flatList}
          onScrollBeginDrag={() => {
            Keyboard.dismiss()
          }}
        />
      </>
    )
  }
}

const styles = StyleSheet.create<any>({
  flatList: {
    paddingBottom: 100,
    ...ifIphoneX({
      marginBottom: 30,
    }),
    backgroundColor: colors.white,
  },
  headerContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(241, 244, 248, 0.4)',
  },
  headerLabel: {
    color: colors.primary_blue,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
  buttonContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: metrics.keylines_screen_edge_margin,
    borderBottomWidth: 1,
    borderColor: colors.border_gray,
  },
  wrapImage: {
    backgroundColor: colors.primary_blue,
    height: metrics.icon_category_size,
    width: metrics.icon_category_size,
    marginRight: metrics.medium_base,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  image: {
    height: metrics.medium_base,
    width: metrics.medium_base,
    tintColor: colors.white,
  },
  wrapButtonTitle: {
    flex: 1,
    paddingRight: metrics.base,
  },
  buttonTitle: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
})
