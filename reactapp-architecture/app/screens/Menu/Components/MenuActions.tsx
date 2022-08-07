import { colors, images, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import I18n from '@/i18n'
import { NavigationScreenProp, withNavigation } from 'react-navigation'
import { AButton2 } from '@/components/AButton/AButton2'
import { TeamMembersScreen } from '@/screens/TeamMembers/TeamMembersScreen'

// init state
const initialState = {
  selectedState: '',
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  navigation: NavigationScreenProp<{}, {}>
}> &
  DefaultProps

export type State = Partial<{}> & Readonly<typeof initialState>

@(withNavigation as any)
export class MenuActions extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  onPress = (routeName: string, param = {}) => () => {
    this.setState({
      selectedState: routeName,
    })
    this.props.navigation.navigate(routeName, param)
  }

  render() {
    const { selectedState } = this.state

    return (
      <View style={styles.container}>
        {/*Profile*/}
        <AButton2
          title={I18n.t('profile')}
          iconLeft={images.user}
          onPress={this.onPress('UserInfoScreen')}
          iconStyle={selectedState === 'UserInfoScreen' && styles.customIcon}
          textStyle={selectedState === 'UserInfoScreen' && styles.customText}
        />

        {/*My Team*/}
        <AButton2
          title={I18n.t('myTeam')}
          iconLeft={images.team}
          onPress={this.onPress('TeamMembersScreen')}
          iconStyle={selectedState === 'TeamMembersScreen' && styles.customIcon}
          textStyle={selectedState === 'TeamMembersScreen' && styles.customText}
        />

        {/*Projects*/}
        {/*<AButton2*/}
        {/*  title={I18n.t('projects')}*/}
        {/*  iconLeft={images.projects}*/}
        {/*  onPress={this.onPress('ProjectScreen')}*/}
        {/*  iconStyle={selectedState === 'ProjectScreen' && styles.customIcon}*/}
        {/*  textStyle={selectedState === 'ProjectScreen' && styles.customText}*/}
        {/*/>*/}

        {/*Tasks*/}
        <AButton2
          title={I18n.t('taskMenu')}
          iconLeft={images.tasksChecked}
          onPress={this.onPress('TasksScreen')}
          iconStyle={selectedState === 'TasksScreen' && styles.customIcon}
          textStyle={selectedState === 'TasksScreen' && styles.customText}
        />

        {/*Samples*/}
        <AButton2
          title={I18n.t('sampleMenu')}
          iconLeft={images.sample}
          onPress={this.onPress('SampleListScreen')}
          iconStyle={selectedState === 'SampleListScreen' && styles.customIcon}
          textStyle={selectedState === 'SampleListScreen' && styles.customText}
        />

        {/*TradeShows*/}
        <AButton2
          title={I18n.t('tradeShows')}
          iconLeft={images.event}
          onPress={this.onPress('EventScreen', { isFromMenu: true })}
          iconStyle={selectedState === 'EventScreen' && styles.customIcon}
          textStyle={selectedState === 'EventScreen' && styles.customText}
        />

        {/*Setting*/}
        <AButton2
          title={I18n.t('setting')}
          iconLeft={images.setting}
          onPress={this.onPress('SettingScreen')}
          iconStyle={selectedState === 'SettingScreen' && styles.customIcon}
          textStyle={selectedState === 'SettingScreen' && styles.customText}
        />

        {/*Projects*/}
        {/*<AButton2*/}
        {/*title={I18n.t('projects')}*/}
        {/*iconLeft={images.project}*/}
        {/*onPress={() => {}}*/}
        {/*/>*/}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: metrics.keylines_screen_edge_margin,
    paddingHorizontal: metrics.keylines_screen_profile_title_margin,
  },
  customIcon: {
    tintColor: colors.primary_blue,
  },
  customText: {
    color: colors.primary_blue,
  },
})
