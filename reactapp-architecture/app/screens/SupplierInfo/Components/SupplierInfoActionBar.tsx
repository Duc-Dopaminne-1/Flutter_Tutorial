import { isIpad } from '@/shared/devices'
import * as React from 'react'
import { AActionBarAvoidKeyboard } from '@/components/AActionBar/AActionBarAvoidKeyboard'
import { supplierNavigation } from '@/navigation/supplierNavigation'

type Props = Readonly<{
  setKeyboardIsShowUp: (keyboardIsShowUp: any) => void
  disable: boolean
}>

export class SupplierInfoActionBar extends React.PureComponent<Props> {
  render() {
    const { setKeyboardIsShowUp, disable } = this.props

    if (isIpad()) return null

    return (
      <AActionBarAvoidKeyboard
        onMove={supplierNavigation.moveHandler}
        onClear={supplierNavigation.clearHandler}
        keyboardIsShowUp={setKeyboardIsShowUp}
        enable={!disable}
      />
    )
  }
}
