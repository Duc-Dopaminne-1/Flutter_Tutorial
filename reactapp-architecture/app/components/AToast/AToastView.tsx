import * as React from 'react'
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import { colors, fonts, metrics } from '@/vars'
import I18n from '@/i18n'
import { onItemCreated, onScrollToComment } from '@/services/global'
import { delay } from 'rxjs/operators'
import { navigation } from '@/navigation/navigation'
import { Subscription } from 'rxjs'
import { Sample, Product, Task, Supplier } from '@/models/team'

type Props = {}

type State = Readonly<{
  isVisible: boolean
  type: 'task' | 'sample' | 'product' | 'comment'
  commentType: 'task' | 'sample' | 'product' | 'supplier'
  id: string
  sample?: Sample
  product?: Product
  supplier?: Supplier
  task?: Task
}>

export class AToastView extends React.PureComponent<Props, State> {
  _fadeAnim = new Animated.Value(0)
  _subscription: Subscription

  readonly state: State = {
    isVisible: false,
    id: '',
    commentType: null,
    type: null,
    sample: null,
    product: null,
    supplier: null,
    task: null,
  }

  componentDidMount(): void {
    this._subscription = onItemCreated.pipe(delay(200)).subscribe(item => {
      const { id, type, sample, product, task, commentType, supplier } = item
      const isVisible = !!type
      this.setState(
        {
          id,
          type,
          isVisible,
          sample,
          product,
          task,
          supplier,
          commentType,
        },
        () => {
          if (isVisible) {
            this.show()
          }
        }
      )
    })
  }

  componentWillUnmount(): void {
    this._subscription && this._subscription.unsubscribe()
  }

  get title() {
    const { type } = this.state
    switch (type) {
      case 'task':
        return I18n.t('taskCreated')
      case 'sample':
        return I18n.t('sampleCreated')
      case 'product':
        return I18n.t('productCreated')
      case 'comment':
        return I18n.t('commentCreated')
      default:
        return ''
    }
  }

  show = () => {
    this.setState({ isVisible: true })

    Animated.sequence([
      Animated.timing(this._fadeAnim, {
        toValue: 1,
        duration: 500,
      }),
      Animated.delay(2000),
      Animated.timing(this._fadeAnim, {
        toValue: 0,
        duration: 500,
      }),
    ]).start(() => {
      this.setState({ isVisible: false })
    })
  }

  onPress = () => {
    const {
      type,
      id,
      sample,
      product,
      task,
      commentType,
      supplier,
    } = this.state
    if (!id || !type) {
      return
    }
    switch (type) {
      case 'task':
        return navigation.navigate('TasksInfoScreen', {
          task,
          taskId: id,
          wasCreated: true,
        })
      case 'sample':
        return navigation.navigate('SampleInfoScreen', {
          sample,
          sampleId: id,
          wasCreated: true,
        })
      case 'product':
        return navigation.navigate('ProductInfoScreen', {
          product,
          productId: id,
          wasCreated: true,
        })
      case 'comment':
        onScrollToComment.next({
          product,
          sample,
          supplier,
          task,
          commentId: id,
          type: commentType,
        })
        break
      default:
        break
    }
  }

  render() {
    const { isVisible } = this.state

    if (!isVisible) {
      return null
    }

    return (
      <Animated.View style={[styles.container, { opacity: this._fadeAnim }]}>
        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.title}>
            {this.title}
          </Text>
          <TouchableOpacity onPress={this.onPress}>
            <Text style={styles.action}>{I18n.t('view').toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create<any>({
  action: {
    color: colors.primary_blue,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPBold,
    fontWeight: 'bold',
  },
  container: {
    position: 'absolute',
    bottom: metrics.product_screen_Toast_container_bottom,
    right: 0,
    marginBottom: 62,
  },
  content: {
    width: metrics.screen_width - 32,
    height: 52,
    padding: metrics.product_screen_Toast_container_padding,
    borderRadius: metrics.product_screen_Toast_container_borderRadius,
    backgroundColor: colors.black08,
    bottom: metrics.product_screen_Toast_container_bottom,
    right: 16,
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
    zIndex: 0,
  },
  title: {
    flex: 1,
    color: colors.white,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    fontWeight: 'normal',
  },
})
