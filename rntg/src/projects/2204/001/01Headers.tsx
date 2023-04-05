import type { Section } from './01constants'
import { MEDIUM_HEADER_HEIGHT, SMALL_HEADER_HEIGHT } from './01constants'
import React from 'react'
import { Dimensions, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { Header } from './01components'

let { Value, Extrapolate, interpolateNode, add, multiply } = Animated
interface Props {
  sections: Section[]
  x: Value
  y: Value
}

let backgroundColor = '#343761'
let { width: dWidth, height: dHeight } = Dimensions.get('window')

function Headers(props: Props) {
  let { sections } = props
  let FULL_HEIGHT_HEADER = dHeight / sections.length
  function tX(index: number) {
    let { x, y } = props
    return add(
      interpolateNode(y, {
        inputRange: [0, dHeight - MEDIUM_HEADER_HEIGHT],
        outputRange: [x, index * dWidth],
        extrapolate: Extrapolate.CLAMP,
      }),
      multiply(x, -1),
    )
  }
  function tY(index: number) {
    let { y } = props
    return interpolateNode(y, {
      inputRange: [
        0,
        dHeight - MEDIUM_HEADER_HEIGHT,
        dHeight - SMALL_HEADER_HEIGHT,
      ],
      outputRange: [index * FULL_HEIGHT_HEADER, 0, 0],
      extrapolate: Extrapolate.CLAMP,
    })
  }
  function getStyle(headerHeight: Value, index: number) {
    let translateX = tX(index)
    let translateY = tY(index)
    return {
      height: headerHeight,
      position: 'absolute',
      top: 0,
      left: 0,
      transform: [{ translateX }, { translateY }],
    }
  }
  let { x, y } = props
  let headerHeight = interpolateNode(y, {
    inputRange: [
      0,
      dHeight - MEDIUM_HEADER_HEIGHT,
      dHeight - SMALL_HEADER_HEIGHT,
    ],
    outputRange: [
      FULL_HEIGHT_HEADER,
      MEDIUM_HEADER_HEIGHT,
      SMALL_HEADER_HEIGHT,
    ],
    extrapolate: Extrapolate.CLAMP,
  })
  return (
    <View
      style={{
        height: dHeight,
        width: sections.length * dWidth,
        backgroundColor,
      }}>
      {sections.map((section, key) => {
        let style = getStyle(headerHeight, key)
        return (
          <Animated.View key={key} style={style}>
            <Header index={key} section={section} />
          </Animated.View>
        )
      })}
    </View>
  )
}

export default Headers
