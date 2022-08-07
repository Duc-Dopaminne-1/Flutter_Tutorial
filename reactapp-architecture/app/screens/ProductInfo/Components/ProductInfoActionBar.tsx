import { isIpad } from '@/shared/devices'
import * as React from 'react'
import { productNavigation } from '@/navigation/productNavigation'
import { AActionBarAvoidKeyboard } from '@/components/AActionBar/AActionBarAvoidKeyboard'

type Props = Readonly<{
  setKeyboardIsShowUp: (keyboardIsShowUp: any) => void
  disable?: boolean
}>

export class ProductInfoActionBar extends React.PureComponent<Props> {
  render() {
    const { setKeyboardIsShowUp, disable } = this.props

    if (isIpad()) return null

    return (
      <AActionBarAvoidKeyboard
        onMove={productNavigation.moveHandler}
        onClear={productNavigation.clearHandler}
        keyboardIsShowUp={setKeyboardIsShowUp}
        enable={!disable}
      />
    )
  }
}
