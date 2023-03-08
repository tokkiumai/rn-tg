import React from 'react'
import { useColorScheme, View } from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  return <View style={backgroundStyle}></View>
}

export default App
