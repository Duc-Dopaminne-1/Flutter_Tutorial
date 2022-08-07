import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { ATitle } from '@/components/ATitle/ATitle'
import I18n from '@/i18n'
import { Tag } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import { images, metrics } from '@/vars'
import { colors } from '@/vars/colors'
import * as React from 'react'
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { withNavigation } from 'react-navigation'
import { ADataRowEmpty } from '@/components/ADataRow/ADataRowEmpty'
import { ADataRowHeader } from '@/components/ADataRow/ADataRowHeader'
import { ADataRowItem } from '@/components/ADataRow/ADataRowItem'

interface ADataRowProps<T> {
  data: T[]
  onPressHeader?: () => void
  label?: string
  description?: string
  headerIcon?: any

  renderItem?: (data: { item: T; index: number }) => React.ReactElement<T>
  ListHeaderComponent?: () => React.ReactElement<T>
  ListEmptyComponent?: () => React.ReactElement<T>
}

export interface ADataRowState<T> {
  data: T[]
  isVisible: boolean
}

type Props = {
  containerStyle?: StyleProp<ViewStyle>
  isGlobal?: boolean
}

@DelayRender({ delay: 200 })
@withContext(AppContext.Consumer)
@(withNavigation as any)
export class ADataRow<T extends Tag> extends React.PureComponent<
  ADataRowProps<T> & AppContextState & Props,
  ADataRowState<T>
> {
  readonly state: ADataRowState<T> = {
    data: [],
    isVisible: false,
  }

  static defaultProps = {
    data: [],
    label: I18n.t('tags'),
    description: I18n.t('noTagsYet'),
    isGlobal: false,
    headerIcon: images.tags,
  }

  static getDerivedStateFromProps<T>(props: ADataRowProps<T>) {
    return {
      data: props.data,
    }
  }

  get dataLength() {
    return this.state.data.length > 0
  }

  renderItem = ({ item, index }) => {
    const tagName = item ? item.name : ''

    if (this.props.renderItem) {
      return this.props.renderItem({ item, index })
    }

    return <ADataRowItem name={tagName} />
  }

  renderHeader = () => {
    if (this.props.ListHeaderComponent) {
      return this.props.ListHeaderComponent()
    }
    return (
      <ADataRowHeader
        headerIcon={this.props.headerIcon}
        onPress={this.props.onPressHeader}
      />
    )
  }

  renderEmpty = () => {
    const { ListEmptyComponent, label, description } = this.props

    if (ListEmptyComponent) {
      return ListEmptyComponent()
    }
    return (
      <ADataRowEmpty
        title={label}
        description={description}
        onPress={this.props.onPressHeader}
        containerStyle={{ paddingVertical: metrics.double_base }}
      />
    )
  }

  renderFlatList = () => {
    const { data } = this.state

    return (
      <>
        <ATitle title={this.props.label} />

        <FlatList<T>
          data={data}
          extraData={data}
          keyExtractor={item => item.id}
          renderItem={this.renderItem}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          ListHeaderComponent={this.renderHeader}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContentContainer}
        />
      </>
    )
  }

  renderFlatListGlobal = () => {
    const { data } = this.state

    return (
      <>
        <ATitle title={this.props.label} />

        <FlatList<T>
          data={data}
          extraData={data}
          keyExtractor={item => item.id}
          renderItem={this.renderItem}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContentContainer}
        />
      </>
    )
  }

  render() {
    const { containerStyle, isGlobal } = this.props
    return (
      <View style={this.dataLength ? [styles.container, containerStyle] : {}}>
        {isGlobal
          ? this.dataLength
            ? this.renderFlatListGlobal()
            : null
          : this.dataLength
            ? this.renderFlatList()
            : this.renderEmpty()}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    backgroundColor: colors.white,
    // paddingHorizontal: metrics.keylines_screen_edge_margin,
    paddingTop: metrics.triple_base,
  },
  flatList: {
    paddingTop: metrics.small_base,
  },
  flatListContentContainer: {
    alignItems: 'center',
  },
})
