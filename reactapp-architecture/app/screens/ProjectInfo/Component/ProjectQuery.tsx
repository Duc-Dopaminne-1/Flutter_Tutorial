import { ProductCard } from '@/cards/Product/ProductCard'
import { Product, Project } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { NavigationService } from '@/services/navigation'
import { isIpad } from '@/shared/devices'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { FlatList, Keyboard, StyleSheet, View } from 'react-native'
import { NavigationInjectedProps, NavigationScreenProp } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { searchKeywordProject } from '@/services/global'
import { Paging } from '@/paging'
import I18n from '@/i18n'
import { colors, devices } from '@/vars'
import { SafeProject } from '@/shared/project'
import { ProjectInfoHeader } from '@/screens/ProjectInfo/Component/ProjectInfoHeader'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { CustomAlert } from '@/shared/alert'
import { map } from 'rxjs/operators'
import { projectProductStore } from '@/stores/projectProductStore'
import { AHeader5 } from '@/components/AHeader/AHeader5'
import { debounce } from 'lodash'
// @ts-ignore
import { ActionSheet } from '@/components/ActionSheet/ActionSheetScreen'

type Props = Readonly<{
  navigation: NavigationScreenProp<{}, {}>
}> &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      project: Project
    }>
  >

export type State = Readonly<{
  project: Project
  products: Realm.Collection<Product>
  selectedId: string
  firstTimeLoadData: boolean
  keyword: string
  isFocus: boolean
}>

@withContext(AppContext.Consumer)
export class ProjectQuery extends React.PureComponent<Props, State> {
  _flatList: React.RefObject<FlatList<Product>> = React.createRef()
  _actionSheet: any = React.createRef()
  _navListener = new NavigationService(this.props.navigation)

  _subscription: Subscription
  _subscriptionProject: Subscription
  _subscriptionDelete: Subscription
  _deleteItemSubSubscription: Subscription
  _updateItemSubSubscription: Subscription

  _results: Realm.Collection<Product> = [] as any
  _resultProject: Realm.Collection<Project> = [] as any
  _productResults: Realm.Collection<Product> = [] as any

  _fuse: FuseService<Product> = new FuseService<Product>([] as any)

  _paging: Paging<Product> = new Paging<Product>([] as any)
  _after: string = null
  _pagingSearch: Paging<Product> = new Paging<Product>([] as any)
  _afterSearch: string = null

  _firstTimeFetchProject: boolean = true
  _isDeletedByMyself: boolean = false
  _timer: NodeJS.Timeout = null
  totalProduct = 0
  _isNavigateToProduct = false

  constructor(props: Props) {
    super(props)
    this.state = {
      project: this.props.navigation.getParam('project', null),
      products: [] as any,
      selectedId: '',
      firstTimeLoadData: true,
      keyword: '',
      isFocus: false,
    }
  }

  componentDidMount() {
    this.fetchProject()
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._subscriptionProject && this._subscriptionProject.unsubscribe()
    this._subscriptionDelete && this._subscriptionDelete.unsubscribe()
    this._deleteItemSubSubscription &&
      this._deleteItemSubSubscription.unsubscribe()
    this._updateItemSubSubscription &&
      this._updateItemSubSubscription.unsubscribe()

    this._productResults &&
      this._productResults.removeAllListeners &&
      this._productResults.removeAllListeners()
    this._resultProject &&
      this._resultProject.removeAllListeners &&
      this._resultProject.removeAllListeners()

    clearTimeout(this._timer)
  }

  fetchProject = () => {
    const { projectFactory, navigation } = this.props
    const project = navigation.getParam('project', {} as any)
    const { id } = new SafeProject(project)

    if (!id) return

    const [subscription, results] = projectFactory.fetchWithId(id)

    this._resultProject = results

    this._subscriptionProject = subscription.subscribe(project => {
      if (project) {
        this.setState({
          project: project as any,
        })

        if (this._firstTimeFetchProject) {
          this.deleteProduct()
          this.fetchProduct()
          this._firstTimeFetchProject = false
        }
      } else {
        this.alertProjectDeleted()
      }
    })
  }

  fetchProduct = () => {
    const { projectFactory, navigation } = this.props
    const project = navigation.getParam('project', {} as any)
    const { id } = new SafeProject(project)
    if (!id) return

    const [subscription, results] = projectFactory.fetchProductFromProject({
      projectId: id,
    })

    this._productResults = results

    this._subscription = subscription.subscribe(data => {
      this.totalProduct = data.length

      const { keyword } = this.state
      this._paging.update(data)
      projectProductStore.initSelect = true

      const newProducts = this._paging.next(null)
      this._after = this._paging.getLatestId(newProducts)
      this.resultUpdate(newProducts as any)
      this.searchUpdate(data, this.state.firstTimeLoadData)

      if (data.length >= 0 && keyword.trim().length === 0) {
        this.setState(
          {
            products: newProducts,
            firstTimeLoadData: false,
          },
          () => {
            searchKeywordProject.next({ text: '' })
          }
        )
      } else if (data.length >= 0 && keyword.trim().length !== 0) {
        this.onChangeText(keyword)
      }
    })
  }

  deleteProject = () => {
    const { projectFactory, navigation } = this.props
    const { project } = this.state
    const { id } = new SafeProject(project)

    if (!id) return

    this._isDeletedByMyself = true
    this._subscriptionDelete = projectFactory.delete(id).subscribe(() => {
      navigation.goBack()
    })
  }

  deleteProduct = () => {
    this._deleteItemSubSubscription = projectProductStore
      .delete()
      .pipe(
        map(value => {
          if (value.index >= this._results.length) {
            return this._results.length - 1
          }

          return value.index
        })
      )
      .subscribe(index => {
        projectProductStore.select().next({
          index,
          item: this._results[index],
        })
      })

    this._updateItemSubSubscription = projectProductStore
      .update()
      .subscribe(value => {
        this.setState({
          selectedId: value.selectedId,
        })
      })
  }

  alertProjectDeleted = () => {
    const { navigation } = this.props

    if (!navigation.isFocused()) return

    this._timer = setTimeout(() => {
      if (!this._isDeletedByMyself) {
        CustomAlert.error({
          message: I18n.t('thisProjectWasDeleted'),
          onPress: () => {
            setTimeout(() => {
              navigation.goBack()
            }, 200)
          },
        })
      }
    }, 0)
  }

  onPressMore = () => {
    !this._isNavigateToProduct && this._actionSheet.show()
  }

  onPressAction = debounce((index: number) => {
    switch (index) {
      case 0:
        this.confirmDelete()
        return
      default:
        return
    }
  }, 100)

  confirmDelete = () => {
    CustomAlert.alertYesNo({
      message: I18n.t('deleteProjectConfirm'),
      onPressYes: this.deleteProject,
      onPressNo: () => {},
    })
  }

  resultUpdate = (products: Realm.Results<Product>) => {
    this._results = products
  }

  searchUpdate = (products, isFirstTime: boolean = false) => {
    if (isFirstTime) {
      this._fuse = new FuseService<Product>(products, {
        keys: [
          'name',
          'description',
          'supplier.name',
          'category.name',
          'tags',
        ] as any,
      })
    } else {
      this._fuse.update(products)
    }
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this.setState({
        keyword,
        products: this._results,
      })
      return
    }

    this.setState({
      keyword,
    })
    this.onSearch(keyword)
  }

  onSearch = (keyword: string) => {
    if (keyword.trim().length === 0) return

    const result = this._fuse.search(keyword.trim())

    this._pagingSearch.update(result.data as any)
    const newProducts = this._pagingSearch.next(null)
    this._afterSearch = this._pagingSearch.getLatestId(newProducts)

    this.setState({
      products: newProducts as any,
    })
  }

  onPressCard = (item: Product, index: number) => {
    const { navigation } = this.props

    if (!isIpad()) {
      this._isNavigateToProduct = true
      navigation.navigate('ProductInfoScreen', {
        productName: item.name,
        productId: item.id,
        wasCreated: true,
      })

      /**
       * This hack to stop show the action bar when navigate to
       * productInfoScreen
       */
      setTimeout(() => {
        this._isNavigateToProduct = false
        this._actionSheet &&
          this._actionSheet._cancel &&
          this._actionSheet._cancel()
      }, 500)
    } else {
      projectProductStore.select().next({
        item,
        index,
      })
    }
  }

  onPressBack = () => {
    this.props.navigation.goBack()
  }

  onPressCancel = () => {
    const { isFocus } = this.state

    if (isFocus) {
      Keyboard.dismiss()
      setTimeout(() => {
        this.onChangeText('')
      }, 0)
      return
    }
  }

  onScrollHandler = () => {
    const { products, keyword } = this.state

    if (!this._paging.isEnd(this._after) && keyword.trim().length === 0) {
      const nextProducts = this._paging.next(this._after)
      this._after = this._paging.getLatestId(nextProducts)
      const newProducts = products.concat(nextProducts)
      this.resultUpdate(newProducts as any)

      this.setState({
        products: newProducts as any,
      })
    } else if (
      !this._pagingSearch.isEnd(this._afterSearch) &&
      keyword.trim().length > 0
    ) {
      const nextProducts = this._pagingSearch.next(this._afterSearch)
      const newProducts = products.concat(nextProducts)

      this._afterSearch = this._pagingSearch.getLatestId(nextProducts)

      this.setState({
        products: newProducts as any,
      })
    }
  }

  onFocus = (isFocus: boolean) => {
    if (devices.isAndroid && isFocus) {
      AndroidKeyboardAdjust.setAdjustPan()
    }

    this.setState({
      isFocus,
    })

    if (isFocus) {
      const params = {
        offset: 0,
        animated: true,
      }

      this._flatList.current && this._flatList.current.scrollToOffset(params)
    }
  }

  renderItem = ({ item, index }) => {
    if (!(item && item.isValid())) return null

    const isSelected = isIpad() && this.state.selectedId === item.id
    const product = { ...item }

    return (
      <ProductCard
        product={product}
        onPress={() => this.onPressCard(product, index)}
        selected={isSelected}
        currentIndex={index}
      />
    )
  }

  render() {
    const { project, keyword, products } = this.state
    const { name } = new SafeProject(project)

    return (
      <View style={styles.container}>
        <AHeader5
          placeholder={`${I18n.t('search')} ${name}`}
          focusPlaceholder={`${I18n.t('search')} ${name}`}
          hasBackIcon={true}
          value={keyword}
          onPressBack={this.onPressBack}
          onPressCancel={this.onPressCancel}
          onChangeText={this.onChangeText}
          onFocus={this.onFocus}
        />

        <ProjectInfoHeader
          project={project}
          totalProduct={this.totalProduct}
          onPressMore={this.onPressMore}
        />

        <FlatList<Product>
          ref={this._flatList}
          data={products}
          extraData={products}
          keyExtractor={(item, index) => item.id + index.toString()}
          renderItem={this.renderItem}
          style={styles.list}
          onScrollBeginDrag={Keyboard.dismiss}
          keyboardShouldPersistTaps={'always'}
          onEndReached={this.onScrollHandler}
          bounces={false}
          onEndReachedThreshold={10}
          windowSize={10}
          initialNumToRender={20}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
        />

        <ActionSheet
          ref={nodeRef => (this._actionSheet = nodeRef)}
          options={[I18n.t('delete'), I18n.t('cancel')]}
          destructiveButtonIndex={0}
          cancelButtonIndex={1}
          firstItem={1}
          lastItem={1}
          onPress={this.onPressAction}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  list: {
    flex: 1,
  },
})
