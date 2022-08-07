import * as React from 'react'
import { StyleSheet } from 'react-native'
import { withContext } from '@/shared/withContext'
import { CreateProductContext } from '@/screens/CreateProduct/CreateProductContext'
import { colors, fonts } from '@/vars'
import I18n from '@/i18n'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { ADataRowEmpty } from '@/components/ADataRow/ADataRowEmpty'
import { ADataText } from '@/components/ADataText/ADataText'

// init state
const initialState = {
  descriptionKey: 1,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  description?: string
  openModal?: (key) => void
} & DefaultProps

export type State = Readonly<typeof initialState>

@withContext(CreateProductContext.Consumer)
export class CreateProductDescription extends React.PureComponent<
  Props,
  State
> {
  readonly state: State = initialState

  openModal = () => {
    createProductNavigation.open(CreateProductRef.Description)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.description !== this.props.description) {
      this.setState({ descriptionKey: this.state.descriptionKey + 1 })
    }
  }

  get hasData() {
    return this.props.description.length > 0
  }

  render() {
    const { description } = this.props

    if (!this.hasData) {
      return (
        <ADataRowEmpty
          title={I18n.t('description')}
          description={I18n.t('noDescriptionYet')}
          onPress={this.openModal}
          containerStyle={{ paddingTop: 24 }}
        />
      )
    }

    return (
      <ADataText
        onOpen={this.openModal}
        description={description && description}
        descriptionKey={this.state.descriptionKey}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  customTitleContainer: {
    paddingBottom: 8,
  },
  description: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.text_grey,
  },
})
