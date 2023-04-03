import type { ImageSourcePropType } from 'react-native'

export interface Section {
  title: string
  leftColor: string
  rightColor: string
  image: ImageSourcePropType
}

export const PADDING = 8
export const CURSOR_WIDTH = 50
export const SMALL_HEADER_HEIGHT = 109
export const MEDIUM_HEADER_HEIGHT = 300
