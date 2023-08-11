import { Platform } from 'react-native'
import ActionSheetMenuAndroid from './ActionSheetMenu.android'

export default Platform.select({ android: ActionSheetMenuAndroid, ios: () => null })
