import * as React from 'react'
import { isIpad } from '@/shared/devices'
import { sampleNavigation } from '@/navigation/sampleNavigation'
import { AActionBarAvoidKeyboard } from '@/components/AActionBar/AActionBarAvoidKeyboard'

type Props = Readonly<{
  setKeyboardIsShowUp: (keyboardIsShowUp: any) => void
  disable: boolean
}>

export class SampleInfoActionBar extends React.PureComponent<Props> {
  render() {
    const { setKeyboardIsShowUp, disable } = this.props

    if (isIpad()) return null

    return (
      <AActionBarAvoidKeyboard
        onMove={sampleNavigation.moveHandler}
        onClear={sampleNavigation.clearHandler}
        keyboardIsShowUp={setKeyboardIsShowUp}
        enable={!disable}
      />
    )
  }
}
