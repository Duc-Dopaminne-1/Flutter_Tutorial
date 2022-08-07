import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { NavigationService } from '@/services/navigation'
import { withContext } from '@/shared/withContext'
import { colors, metrics } from '@/vars'
import * as React from 'react'
import { ScrollView, StatusBar, StyleSheet } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { SearchKeywordType } from '@/services/global'
import { MultiSearchProductQuery } from '@/screens/MultiSearch/Components/MultiSearchProductQuery'
import { MultiSearchSupplierQuery } from '@/screens/MultiSearch/Components/MultiSearchSupplierQuery'
import { MultiSearchTaskQuery } from '@/screens/MultiSearch/Components/MultiSearchTaskQuery'
import { MultiSearchSampleQuery } from '@/screens/MultiSearch/Components/MultiSearchSampleQuery'
import { APlaceholderMultiSearch } from '@/components/APlaceHolder/APlaceholderMultiSearch'

type Props = Readonly<{
  keyword?: string
}> &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

export type State = Readonly<{
  emptyProductSearchResult: boolean
  emptySupplierSearchResult: boolean
  emptyTaskSearchResult: boolean
  emptySampleSearchResult: boolean
  [key: string]: any
}>

@(withNavigation as any)
@withContext(AppContext.Consumer)
export class MultiSearchQuery extends React.PureComponent<Props, State> {
  _navListener = new NavigationService(this.props.navigation)

  readonly state: State = {
    emptyProductSearchResult: false,
    emptySupplierSearchResult: false,
    emptyTaskSearchResult: false,
    emptySampleSearchResult: false,
  }

  componentDidMount() {
    this._navListener.didFocus(() => {
      StatusBar.setBarStyle('light-content', true)
    })
  }

  componentWillUnmount() {
    this._navListener.removeListener()
  }

  updateState = (key, data) => {
    this.setState({
      [key]: data,
    })
  }

  renderEmptyPlaceholder = () => {
    const {
      emptyProductSearchResult,
      emptySupplierSearchResult,
      emptyTaskSearchResult,
      emptySampleSearchResult,
    } = this.state

    // const hide =
    //   !emptyProductSearchResult ||
    //   !emptySupplierSearchResult ||
    //   !emptyTaskSearchResult ||
    //   !emptySampleSearchResult

    if (
      emptyProductSearchResult &&
      emptySupplierSearchResult &&
      emptyTaskSearchResult &&
      emptySampleSearchResult
    ) {
      return <APlaceholderMultiSearch hide={false} />
    }

    return null
  }

  render() {
    // const { keyword } = this.props
    //
    // if(keyword === '') {
    //   return <MultiSearchPlaceholder />
    // }

    return (
      <>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <MultiSearchProductQuery
            type={SearchKeywordType.AllProduct}
            updateState={this.updateState}
          />

          <MultiSearchSupplierQuery
            type={SearchKeywordType.AllSupplier}
            updateState={this.updateState}
          />

          <MultiSearchTaskQuery
            type={SearchKeywordType.AllTasks}
            updateState={this.updateState}
          />

          <MultiSearchSampleQuery
            type={SearchKeywordType.AllSamples}
            updateState={this.updateState}
          />
        </ScrollView>
        {this.renderEmptyPlaceholder()}
      </>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  contentContainerStyle: {
    paddingBottom: metrics.double_base,
  },
})
