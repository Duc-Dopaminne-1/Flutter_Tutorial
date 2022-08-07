import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { Supplier } from '@/models/team'
import {
  supplierNavigation,
  SupplierRef,
} from '@/navigation/supplierNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { IteratorCountry, SafeCountry } from '@/shared/country'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import { Subscription } from 'rxjs'
import { SelectCountryList } from './Components/SelectCountryList'
import { Keyboard } from 'react-native'

const countries = SafeCountry.data()

// init state
const initialState = {
  keyword: '',
  data: countries,
  loading: true,
  isPerfect: true,
  renderKey: 0,
}

type Props = AppContextState &
  Partial<
    NavigationInjectedProps<{
      selectedItem: Supplier
    }>
  >

export type State = Readonly<{
  keyword: string
  data: Realm.Collection<IteratorCountry>
  loading: boolean
  isPerfect: boolean
  renderKey: number
}>

@withContext(AppContext.Consumer)
export class SelectCountryPicker extends React.PureComponent<Props, State> {
  _fuse = new FuseService<IteratorCountry>(countries)
  _subscription: Subscription
  _modal

  readonly state: State = initialState

  componentDidMount() {
    this.open()
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this.setState({
        keyword,
        isPerfect: true,
        data: countries,
      })
      return
    }

    this.setState(
      {
        keyword,
      },
      () => this.onSearch(keyword)
    )
  }

  onSelect = (country: string) => {
    const { supplierFactory, navigation } = this.props
    const selectedItem = navigation.getParam('selectedItem', null)

    Keyboard.dismiss()

    setTimeout(() => {
      supplierFactory
        .update(selectedItem.id, {
          country,
        })
        .subscribe(() => {
          this.close()
        })
    }, 10)
  }

  onSearch = (keyword: string) => {
    if (keyword.trim().length === 0) return

    const result = this._fuse.search(keyword.trim())

    this.setState({
      data: result.data as any,
      isPerfect: result.isPerfect,
    })
  }

  open = () => {
    this._modal && this._modal.open()
  }

  close = () => {
    this._modal && this._modal.close()
  }

  onClear = () => {
    this.setState({
      isPerfect: true,
      data: countries,
      keyword: '',
      renderKey: this.state.renderKey + 1,
    })
    this._fuse.update(countries)
  }

  render() {
    const { keyword, data, renderKey } = this.state

    return (
      <AModal3
        ref={nodeRef => {
          this._modal = nodeRef
          supplierNavigation.setRef(SupplierRef.SelectCountry, nodeRef)
        }}
        headerProps={{
          title: I18n.t('selectCountry'),
          onPressIconRight: this.close,
        }}
        textInputProps={{
          onChangeText: this.onChangeText,
          value: keyword,
          text: I18n.t('enterCountryName'),
        }}
        onClear={this.onClear}
        renderKey={renderKey}
      >
        <SelectCountryList
          data={data}
          onPress={this.onSelect}
          keyword={keyword.trim()}
        />
      </AModal3>
    )
  }
}
