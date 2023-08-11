import React from 'react'
import { View, Text, Platform, Pressable, ActionSheetIOS, StyleSheet } from 'react-native'
import type { ViewStyle } from 'react-native'
import ActionSheetMenuAndroid from 'projects/tmp/ActionSheet/ActionSheetMenu.android'

interface Entry {
  label: string
  key?: string
}

interface Props {
  title?: string
  entries: Array<Entry>
  onSelect: (value: string) => void
  children?: React.JSX.Element
  disabled?: boolean
  style?: ViewStyle
}

function ActionSheet({ entries, title, onSelect, disabled, style, children }: Props) {
  function handleOpen() {
    Platform.select({
      ios: () =>
        ActionSheetIOS.showActionSheetWithOptions(
          {
            title,
            options: entries.map(e => e.label),
          },
          i => {
            handleSelect(entries[i])
          },
        ),
    })
  }
  function handleSelect(entry: Entry) {
    if (typeof onSelect === 'function') {
      onSelect(entry.key ?? entry.label)
    }
  }
  return (
    <Pressable onPress={handleOpen} style={style} disabled={disabled}>
      {Platform.select({
        ios: children,
        android: <ActionSheetMenuAndroid handleSelect={handleSelect} entries={entries} title={title} />,
      })}
    </Pressable>
  )
}

const styles = StyleSheet.create({})

export default ActionSheet
