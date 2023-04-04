import type { Section } from './01constants'
import {
  CURSOR_WIDTH,
  MEDIUM_HEADER_HEIGHT,
  PADDING,
  SMALL_HEADER_HEIGHT,
} from './01constants'
import React from 'react'
import { Dimensions, Image, Platform, StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'

let { width: dWidth, height: dHeight } = Dimensions.get('window')

let cStyles = StyleSheet.create({
  root: {
    flex: 1,
    width: dWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cursor: {
    top: 30,
    width: CURSOR_WIDTH,
    height: 5,
    backgroundColor: 'white',
  },
})

export function Cursor() {
  return (
    <View style={cStyles.root}>
      <View style={cStyles.cursor} />
    </View>
  )
}

let hStyles = StyleSheet.create({
  root: { flex: 1, width: dWidth },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
})

interface HeaderProps {
  section: Section
}

export function Header({ section }: HeaderProps) {
  return (
    <View style={hStyles.root}>
      <Image source={section.image} style={hStyles.image} />
    </View>
  )
}

let { Value, Extrapolate, interpolateNode } = Animated

interface LabelProps {
  section: Section
  x: typeof Value
  y: typeof Value
  index: number
}

let charWidth = Platform.OS === 'ios' ? 19.3 : 19
let fontSize = 32
let fontFamily = Platform.OS === 'ios' ? 'Menlo' : 'monospace'

let lStyles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    padding: PADDING,
    justifyContent: 'center',
  },
  label: {
    color: 'white',
    textAlign: 'center',
    fontSize,
    fontFamily,
  },
})

export function Label(props: LabelProps) {
  let { x, y, index, section } = props
  let opacity = interpolateNode(x, {
    inputRange:
      index === 0
        ? [0, 0, dWidth]
        : [dWidth * (index - 1), dWidth * index, dWidth * (index + 1)],
    outputRange: [0.5, 1, 0, 5],
    extrapolate: Extrapolate.CLAMP,
  })
  let labelWidth = interpolateNode(y, {
    inputRange: [
      0,
      dHeight - MEDIUM_HEADER_HEIGHT,
      dHeight - SMALL_HEADER_HEIGHT,
    ],
    outputRange: [section.title.length * charWidth, dWidth, dWidth],
    extrapolate: Extrapolate.CLAMP,
  })
  return (
    <Animated.View style={[lStyles.root, { opacity }]}>
      <Animated.Text style={[lStyles.label, { width: labelWidth }]}>
        {section.title.toUpperCase()}
      </Animated.Text>
    </Animated.View>
  )
}
