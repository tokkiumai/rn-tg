import React from 'react'
import { Dimensions } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Card from './Card'

let { width, height } = Dimensions.get('window')

interface Props {
  color: string
  index: 0 | 1 | 2
  priority: Animated.SharedValue<number>
  firstPrt: Animated.SharedValue<number>
  secondPrt: Animated.SharedValue<number>
  thirdPrt: Animated.SharedValue<number>
}

function Wrapper(props: Props) {
  let yTranslation = useSharedValue(30)
  let rotation = useSharedValue(30)
  let isRFlick = useSharedValue(true)
  let gesture = Gesture.Pan()
    .onBegin(({ absoluteX, translationY }) => {
      if (absoluteX < width / 2) {
        isRFlick.value = false
      }
      yTranslation.value = translationY + 30
      rotation.value = translationY + 30
    })
    .onUpdate(({ translationY }) => {
      yTranslation.value = translationY + 30
      rotation.value = translationY + 30
    })
    .onEnd(() => {
      let { firstPrt, secondPrt, thirdPrt } = props
      let priorities = [firstPrt.value, secondPrt.value, thirdPrt.value]
      let lastItem = priorities[priorities.length - 1]
      for (let i = priorities.length; i > 0; i -= 1) {
        priorities[i] = priorities[i - 1]
      }
      priorities[0] = lastItem
      firstPrt.value = priorities[0]
      secondPrt.value = priorities[1]
      thirdPrt.value = priorities[2]
      yTranslation.value = withTiming(
        30,
        { duration: 400, easing: Easing.quad },
        () => {
          isRFlick.value = true
        },
      )
      rotation.value = withTiming(
        -1280,
        { duration: 400, easing: Easing.linear },
        () => {
          rotation.value = 30
        },
      )
    })
  let animStyle = useAnimatedStyle(() => {
    function getPosition() {
      switch (props.priority as unknown) {
        case 1:
          return 50
        case 0.9:
          return 75
        case 0.8:
          return 100
        default:
          return 0
      }
    }

    return {
      position: 'absolute',
      height: 200,
      width: 325,
      backgroundColor: props.color,
      bottom: withTiming(getPosition(), { duration: 500 }),
      borderRadius: 8,
      zIndex: props.priority.value * 100,
      transform: [
        { translateY: yTranslation.value },
        {
          rotate: `${interpolate(
            rotation.value,
            isRFlick.value ? [30, height] : [30, -height],
            [0, 4],
          )}rad`,
        },
        {
          scale: withTiming(props.priority.value, {
            duration: 250,
            easing: Easing.linear,
          }),
        },
      ],
    }
  })

  return (
    <GestureDetector gesture={gesture}>
      <Card colorIndex={props.index} style={animStyle} />
    </GestureDetector>
  )
}
