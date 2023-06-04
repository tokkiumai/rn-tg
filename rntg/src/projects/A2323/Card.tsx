import React from 'react'
import type { ViewStyle } from 'react-native'
import { StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'

interface Props {
  colorIndex: 0 | 1 | 2
  style: ViewStyle
}

let colors = {
  light_blue: '#afd0ff',
  light_gold: '#e8d38f',
  light_red: '#ff7e85',
  dark_blue: '#4a64a8',
  dark_gold: '#85692a',
  dark_red: '#992e1e',
}

function Card({ colorIndex, style }: Props) {
  function getColor() {
    switch (colorIndex) {
      case 0:
        return colors.dark_blue
      case 1:
        return colors.dark_red
      case 2:
        return colors.dark_gold
    }
  }
  return (
    <Animated.View style={style}>
      <View style={styles.separator} />
      <View style={styles.wrapper}>
        <View
          style={StyleSheet.flatten([
            styles.circle,
            { backgroundColor: getColor() },
          ])}
        />
        <View>
          <View
            style={StyleSheet.flatten([
              styles.topLine,
              { backgroundColor: getColor() },
            ])}
          />
          <View
            style={StyleSheet.flatten([
              styles.bottomLine,
              { backgroundColor: getColor() },
            ])}
          />
        </View>
      </View>
    </Animated.View>
  )
}
let styles = StyleSheet.create({
  separator: { flex: 1 },
  wrapper: { flexDirection: 'row' },
  circle: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginBottom: 20,
    marginLeft: 15,
  },
  topLine: {
    height: 20,
    width: 120,
    borderRadius: 40,
    marginBottom: 20,
    marginLeft: 15,
  },
  bottomLine: {
    height: 20,
    width: 60,
    borderRadius: 40,
    marginBottom: 20,
    marginLeft: 15,
  },
})
export default Card
