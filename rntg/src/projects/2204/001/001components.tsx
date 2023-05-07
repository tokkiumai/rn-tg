import React from 'react'
import Animated, {
  interpolate,
  SensorType,
  useAnimatedSensor,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { Dimensions, StyleSheet, View } from 'react-native'

let { width: dWidth } = Dimensions.get('window')
const DISTANCE = dWidth
const SIZE = dWidth * 1.25

interface Props {
  color: string
  scale?: number
}

function Circle({ color, scale = 1 }: Props) {
  let animatedSensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: 10,
  })
  let animatedStyle = useAnimatedStyle(() => {
    let { qw, qx } = animatedSensor.sensor.value
    let y = interpolate(qx, [0, 0.5, 1], [1, 0, -1])
    return {
      transform: [
        { translateX: withSpring((qw * DISTANCE) / scale) },
        { translateY: withSpring((y * DISTANCE) / scale) },
      ],
    }
  })
  return (
    <View style={styles.root}>
      <Animated.View
        style={StyleSheet.flatten([
          {
            backgroundColor: color,
            width: SIZE * scale,
            height: SIZE * scale,
            borderRadius: (SIZE / 2) * scale,
          },
          animatedStyle,
        ])}
      />
    </View>
  )
}

let colors = ['#ffea5e', '#fff4a3', '#ffacd6']

function App() {
  return (
    <View style={styles.app}>
      {colors.map((color, i) => (
        <Circle key={color} scale={1 - i * 0.1} color={colors[i]} />
      ))}
    </View>
  )
}

let styles = StyleSheet.create({
  root: { position: 'absolute' },
  app: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default App
