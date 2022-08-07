declare module 'react-native-android-keyboard-adjust' {
  export const setAdjustNothing: () => void
  export const setAdjustPan: () => void
  export const setAdjustResize: () => void
  export default (AndroidKeyboardAdjust = {
    setAdjustNothing,
    setAdjustPan,
    setAdjustResize,
  })
}
