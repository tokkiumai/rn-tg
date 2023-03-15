import type { ReactNode } from 'react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

interface Props {
  children: ReactNode
}

export default function Background({ children }: Props) {
  return <View style={styles.root}>{children}</View>
}

let styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
