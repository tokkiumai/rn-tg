import type { SkFont } from '@shopify/react-native-skia'
import { Group, Text } from '@shopify/react-native-skia'
import React from 'react'
import { Dimensions } from 'react-native'

import { Calendar, Clock, Database } from './Icons'

let { width } = Dimensions.get('window')

interface Props {
  font: SkFont
  size: string
  duration: string
}

let updated = 'Just now'
function Labels({ font, size, duration }: Props) {
  let s1 = (width - (30 + font.getTextWidth(updated))) / 2
  let s3 = width - 16 - (30 + font.getTextWidth(duration))
  return (
    <Group
      transform={[{ translateX: 16 }, { translateY: 112.5 }, { scale: 0.7 }]}>
      <Group transform={[{ translateX: 16 }]}>
        <Database />
        <Text x={30} y={18} text={size} color="white" font={font} />
      </Group>
      <Group transform={[{ translateX: s1 }]}>
        <Calendar />
        <Text x={30} y={18} text={updated} color="white" font={font} />
      </Group>
      <Group transform={[{ translateX: s3 }]}>
        <Clock />
        <Text x={30} y={18} text={duration} color="white" font={font} />
      </Group>
    </Group>
  )
}

export default Labels
