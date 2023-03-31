import type { SkFont } from '@shopify/react-native-skia'
import {
  Canvas,
  Easing,
  Group,
  Image,
  Paint,
  Rect,
  rect,
  RoundedRect,
  RuntimeShader,
  runTiming,
  Skia,
  Text,
  useComputedValue,
  useImage,
  useTouchHandler,
  useValue,
} from '@shopify/react-native-skia'
import React from 'react'
import { Dimensions, PixelRatio } from 'react-native'
import { Trash } from './Icons'
import Labels from './Labels'
import { PageCurl } from './templates'

const { width: wWidth } = Dimensions.get('window')
const wHeight = 150
const pd = PixelRatio.get()
const outer = Skia.XYWHRect(0, 0, wWidth, wHeight)
const pad = 16
const cornerRadius = 16
let inner = Skia.RRectXY(
  Skia.XYWHRect(pad, pad, wWidth - pad * 2, wHeight - pad * 2),
  cornerRadius,
  cornerRadius,
)
let labelHeight = 25

export interface rCanvas {
  id: string
  title: string
  size: string
  duration: string
  picture: number
  color: string
}

interface Props {
  project: rCanvas
  font: SkFont
  smallFont: SkFont
}

function Project({ font, smallFont, project }: Props) {
  let { title, size, duration, picture, color } = project
  let { width } = outer
  let origin = useValue(width)
  let image = useImage(picture)
  let pointer = useValue(width)
  let onTouch = useTouchHandler({
    onStart: ({ x }) => {
      origin.current = x
    },
    onActive: ({ x }) => {
      pointer.current = x
    },
    onEnd: () => {
      runTiming(pointer, width, {
        duration: 450,
        easing: Easing.inOut(Easing.ease),
      })
      runTiming(origin, width, {
        duration: 450,
        easing: Easing.inOut(Easing.ease),
      })
    },
  })
  let uniforms = useComputedValue(() => {
    return {
      pointer: pointer.current * pd,
      origin: origin.current * pd,
      resolution: [outer.width * pd, outer.height * pd],
      countainer: [
        inner.rect.x,
        inner.rect.y,
        inner.rect.x + inner.rect.width,
        inner.rect.y + inner.rect.height,
      ].map(v => v * pd),
      cornerRadius: cornerRadius * pd,
    }
  }, [origin, pointer])
  if (!image) {
    return null
  }
  return (
    <Canvas
      style={{ width: outer.width, height: outer.height }}
      onTouch={onTouch}>
      <RoundedRect rect={inner} color="red" />
      <Group
        transform={[
          { translateX: 310 },
          { translateY: (150 - 24 * 1.5) / 2 },
          { scale: 1.5 },
        ]}>
        <Trash />
      </Group>
      <Group transform={[{ scale: 1 / pd }]}>
        <Group
          layer={
            <Paint>
              <RuntimeShader source={PageCurl} uniforms={uniforms} />
            </Paint>
          }
          transform={[{ scale: pd }]}
          clip={inner}>
          <Image image={image} rect={inner.rect} fit="cover" />
          <Rect
            rect={rect(
              inner.rect.x,
              inner.rect.y + inner.rect.height - labelHeight,
              inner.rect.width,
              labelHeight,
            )}
            color={color}
          />
          <Labels size={size} font={smallFont} duration={duration} />
          <Text
            x={32}
            y={wHeight - 50}
            text={title}
            color="white"
            font={font}
          />
        </Group>
      </Group>
    </Canvas>
  )
}

export default Project
