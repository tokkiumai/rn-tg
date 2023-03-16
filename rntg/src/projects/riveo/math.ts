import type { Vector } from '@shopify/react-native-skia'
import { vec } from '@shopify/react-native-skia'

export function vecScale(v: Vector, b: number): Vector {
  return vec(v.x * b, v.y * b)
}

export function vecLength(v: Vector): number {
  return Math.hypot(v.x, v.y)
}

export function vecNormalize(v: Vector): Vector {
  return vecScale(v, 1 / vecLength(v))
}

export function dot(a: Vector, b: Vector): number {
  return a.x * b.x + a.y * b.y
}
