import React from 'react'
import { useColorScheme, View } from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'
import Circle from 'projects/2204/001/001components'

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  }

  return (
    <View style={backgroundStyle}>
      <Circle />
    </View>
  )
}

export default App
