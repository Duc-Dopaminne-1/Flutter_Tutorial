import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { withNavigation } from 'react-navigation'
import { AModal2 } from '@/components/AModal/AModal2'
import { CreateExtendFieldForm } from '@/modals/CreateExtendField/Components/CreateExtendFieldForm'
import { extendField } from '@/services/global'

// init state
const initialState = {
  type: '',
  order: '0',
  label: '',
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = DefaultProps & AppContextState

export type State = Partial<{
  [key: string]: any
}> &
  Readonly<typeof initialState>

@(withNavigation as any)
export class CreateExtendField extends React.PureComponent<Props, State> {
  _modal

  readonly state: State = initialState

  async componentDidMount() {
    this.open()
  }

  componentWillUnmount() {}

  open = () => {
    if (this._modal) {
      this._modal.open()
    }
  }

  close = () => {
    if (this._modal) {
      this._modal.close()
    }
  }

  onChangeText = key => value => {
    this.setState({
      [key]: value,
    })
  }

  submit = () => {
    const { type, order, label } = this.state

    extendField.next({
      type,
      order,
      label,
    })
    this.close()
  }

  render() {
    const { type, order, label } = this.state

    return (
      <AModal2
        ref={nodeRef => {
          this._modal = nodeRef
        }}
      >
        <CreateExtendFieldForm
          type={type}
          order={order}
          label={label}
          onChangeText={this.onChangeText}
          submit={this.submit}
        />
      </AModal2>
    )
  }
}
