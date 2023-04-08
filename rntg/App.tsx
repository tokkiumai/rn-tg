import React from 'react'
import { useColorScheme, View } from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'
import Riveo from './src/projects/riveo/Riveo'

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  }

  return (
    <View style={backgroundStyle}>
      <Riveo />
    </View>
  )
}

export default App
