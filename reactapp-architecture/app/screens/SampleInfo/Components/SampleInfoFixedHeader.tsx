import * as React from 'react'
import { selectPlatform } from '@/shared/devices'
import { colors, images } from '@/vars'
import { StyleSheet } from 'react-native'
import { withContext } from '@/shared/withContext'
import { SampleInfoContext } from '@/screens/SampleInfo/SampleInfoContext'
import { AHeaderFixed } from '@/components/AHeader/AHeaderFixed'
import { SafeSample } from '@/shared/sample'

type Props = Readonly<{
  safeSample?: SafeSample
  asComponent?: any
  headerVisible?: any
  onPressIconLeft?: () => void
}>

@withContext(SampleInfoContext.Consumer)
export class SampleInfoFixedHeader extends React.PureComponent<Props> {
  render() {
    const {
      safeSample,
      asComponent,
      headerVisible,
      onPressIconLeft,
    } = this.props

    return (
      <AHeaderFixed
        title={!headerVisible && safeSample.name}
        iconLeft={asComponent ? null : images.leftChevron}
        onPressIconLeft={onPressIconLeft}
        color={
          headerVisible
            ? [colors.black, colors.transparent]
            : [
                selectPlatform(
                  {
                    iPad: colors.background,
                    default: colors.white,
                  },
                  !asComponent
                ),
                selectPlatform(
                  {
                    iPad: colors.background,
                    default: colors.white,
                  },
                  !asComponent
                ),
              ]
        }
        titleStyle={
          !headerVisible && {
            color: colors.black,
            fontWeight: selectPlatform<any>({
              iPad: '400',
              default: '600',
            }),
          }
        }
        iconLeftStyle={!headerVisible && { tintColor: colors.black }}
        iconLeftTextStyle={!headerVisible && { color: colors.black }}
        containerStyle={!headerVisible && styles.customHeader}
      />
    )
  }
}

const styles = StyleSheet.create({
  customHeader: {
    borderBottomWidth: 1,
    borderColor: colors.border_gray,
  },
})
