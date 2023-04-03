import type { Section } from './01constants'
import { CURSOR_WIDTH } from './01constants'
import React from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'

let { width: dWidth } = Dimensions.get('window')

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
