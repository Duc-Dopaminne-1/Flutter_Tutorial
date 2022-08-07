import { NavigationTransitionProps } from 'react-navigation'

export const Fade = (props: NavigationTransitionProps) => {
  const { position, scene } = props

  const index = scene.index

  const translateX = 0
  const translateY = 0

  const opacity = position.interpolate({
    inputRange: [index - 0.7, index, index + 0.7],
    outputRange: [0.3, 1, 0.3],
  })

  return {
    opacity,
    transform: [{ translateX }, { translateY }],
  }
}
