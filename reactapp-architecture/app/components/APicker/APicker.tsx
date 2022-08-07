import { metrics } from '@/vars'
import React from 'react'
import { Picker, SafeAreaView, StyleSheet } from 'react-native'

// const Picker = Platform.OS === 'ios' ? PickerIOS : PickerIOS
//
// export const PickerItem = Picker.Item

export type APickerProps<T> = {
  data: Realm.Collection<T> | { [key: string]: string }[]
  value: string
  onValueChange?(value: string | number): void
  renderItem?(): JSX.Element[]
}

export class APicker<T> extends React.PureComponent<APickerProps<T>> {
  static readonly defaultProps = {}

  render() {
    const { data, value, onValueChange, renderItem } = this.props
    return (
      <SafeAreaView>
        <Picker
          selectedValue={value}
          style={styles.container}
          onValueChange={onValueChange}
        >
          {renderItem
            ? renderItem()
            : Object.entries(data).map(([key, val]) => (
                <Picker.Item key={key} label={val} value={key} />
              ))}
        </Picker>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: metrics.modal_small_content_height,
    width: metrics.screen_width,
  },
})
