import * as React from 'react'
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native'
import I18n from '@/i18n'
import ActionSheet from 'react-native-actionsheet'
import { SampleQuery } from './SampleQuery'
import { Factory } from '@/services/factory'
import { NavigationInjectedProps, DrawerActions } from 'react-navigation'
import { colors, images } from '@/vars'
import { SearchKeywordType, onDeleteSample } from '@/services/global'
import { AScrollableTabViewSamples } from '@/components/AScrollableTabView/AScrollableTabViewSamples'
import { User } from '@/models/user'
import { Sample } from '@/models/team'
import { NavigationService } from '@/services/navigation'
import { AppContext } from '../App/AppContext'
import { withContext } from '@/shared/withContext'
import { AppContextState } from '../App/AppContainer'
import { SampleActionType } from './Components/SampleQueryRow'
import { isEmpty } from 'lodash'
import LinearGradient from 'react-native-linear-gradient'
import { navigation } from '@/navigation/navigation'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'

type Props = Partial<{
  fromMultiSearch?: boolean
}> &
  Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{
  filterBy: string
  selectedUser: User
}>

@withContext(AppContext.Consumer)
export class SampleListScreen extends React.PureComponent<Props, State> {
  _actionSheet: React.RefObject<ActionSheet> = React.createRef()
  _actionSheetDelete: React.RefObject<ActionSheet> = React.createRef()
  _scrollableTabView?: any
  _sample?: Sample

  static defaultProps = {
    fromMultiSearch: false,
  }

  readonly state: State = {
    filterBy: undefined,
    selectedUser: null,
  }

  onPressBack = () => {
    // Go back and close the drawer
    this.props.navigation.navigate(
      'HomeScreen',
      {},
      this.props.navigation.dispatch(DrawerActions.closeDrawer()) as any
    )
  }

  onSampleAction = (sample: Sample, type: SampleActionType) => {
    this._sample = sample
    switch (type) {
      case 'delete':
        this._actionSheetDelete.current &&
          this._actionSheetDelete.current.show &&
          this._actionSheetDelete.current.show()
        break
      case 'reAssign':
        navigation.navigate('SelectUserPicker', {
          onUserSelect: this.onUserSelect,
          selected: sample.assignee,
          hideUpDownClear: true,
        })
        break
      default:
        break
    }
  }

  onSampleCreate = () => {
    navigation.navigate('CreateSamplePicker', {})
    // this.props.navigation.navigate('CreateSamplePicker')
  }

  updateSample = (type: SampleActionType) => {
    if (!this._sample) {
      return
    }
    const updateProps: any = {}
    const { sampleFactory } = this.props

    if (type === 'reAssign') {
      const { selectedUser } = this.state
      if (!selectedUser) {
        this._sample = null
        return
      }
      updateProps.assignee = selectedUser
    }
    if (type === 'delete') {
      updateProps.deleted = true
    }

    if (isEmpty(updateProps)) {
      this._sample = null
      return
    }
    sampleFactory.update(this._sample.id, updateProps).subscribe(() => {
      if (type === 'delete') {
        onDeleteSample.next()
      }
    })
    this._sample = null
  }

  onViewAll = () => {
    this._scrollableTabView && this._scrollableTabView.goToPage(2)
  }

  onFilterSelect = (index: number) => {
    switch (index) {
      case 1: // Ongoing Samples
        this.setState({
          filterBy: '(status.final = false)',
        })
        return
      case 2: // Validated Samples
        this.setState({
          filterBy: '(status.final = true)',
        })
        return
      case 3: // All Samples
        this.setState({ filterBy: undefined })
        return
      default:
        return
    }
  }

  onUserSelect = (user: User) => {
    this.setState({ selectedUser: user }, () => this.updateSample('reAssign'))
  }

  render() {
    const { filterBy } = this.state

    const { fromMultiSearch } = this.props
    if (fromMultiSearch) {
      return (
        <>
          <SampleQuery
            tabLabel={I18n.t('sampleAllSamples')}
            query={filterBy ? `${filterBy}` : ''}
            type={SearchKeywordType.AllSamples}
            disableSwipeActions={true}
            fromMultiSearch={fromMultiSearch}
            onAction={this.onSampleAction}
          />
          <ActionSheet
            ref={this._actionSheet}
            title={I18n.t('sampleFilter')}
            options={[
              I18n.t('cancel'),
              I18n.t('sampleIncomplete'),
              I18n.t('sampleCompleted'),
              I18n.t('sampleAll'),
            ]}
            cancelButtonIndex={0}
            onPress={this.onFilterSelect}
          />
          <ActionSheet
            ref={this._actionSheetDelete}
            options={[I18n.t('cancel'), I18n.t('delete')]}
            cancelButtonIndex={0}
            destructiveButtonIndex={1}
            onPress={(index: number) =>
              index === 1 && this.updateSample('delete')
            }
          />
        </>
      )
    }
    return (
      <View style={styles.container}>
        <AScrollableTabViewSamples
          ref={ref => (this._scrollableTabView = ref)}
          placeholderSearch={I18n.t('sampleSearch')}
          focusPlaceholderSearch={I18n.t('sampleSearch')}
          onPressBack={this.onPressBack}
          onPressIcon={() => {
            this._actionSheet.current.show()
          }}
        >
          <SampleQuery
            tabLabel={I18n.t('sampleAssignedToMe')}
            query={`assignee.id = "${Factory.user().identity}"${
              filterBy ? ` AND ${filterBy}` : ''
            }`}
            type={SearchKeywordType.AssignedToMeSamples}
            onAction={this.onSampleAction}
            onViewAll={this.onViewAll}
          />
          <SampleQuery
            tabLabel={I18n.t('sampleMySamples')}
            query={`createdBy.id = "${Factory.user().identity}"${
              filterBy ? ` AND ${filterBy}` : ''
            }`}
            type={SearchKeywordType.MySamples}
            onAction={this.onSampleAction}
            onViewAll={this.onViewAll}
          />
          <SampleQuery
            tabLabel={I18n.t('sampleAllSamples')}
            query={filterBy ? `${filterBy}` : ''}
            type={SearchKeywordType.AllSamples}
            onAction={this.onSampleAction}
          />
        </AScrollableTabViewSamples>
        <ActionSheet
          ref={this._actionSheet}
          title={I18n.t('sampleFilter')}
          options={[
            I18n.t('cancel'),
            I18n.t('sampleIncomplete'),
            I18n.t('sampleCompleted'),
            I18n.t('sampleAll'),
          ]}
          cancelButtonIndex={0}
          onPress={this.onFilterSelect}
        />
        <ActionSheet
          ref={this._actionSheetDelete}
          options={[I18n.t('cancel'), I18n.t('delete')]}
          cancelButtonIndex={0}
          destructiveButtonIndex={1}
          onPress={(index: number) =>
            index === 1 && this.updateSample('delete')
          }
        />
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={this.onSampleCreate}
        >
          <LinearGradient
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={['#d97bff', '#45adff']}
            style={styles.addButton}
          >
            <Image source={images.add} style={styles.addImage} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
  },
  addButtonContainer: {
    ...Platform.select({
      ios: {
        width: 68,
        height: 68,
      },
      android: {
        width: 64,
        height: 64,
      },
    }),
    borderRadius: 34,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 32,
    bottom: 32,
    shadowColor: 'rgba(203, 128, 255, 0.4)',
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    elevation: 3,
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImage: {
    tintColor: colors.white,
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
})
