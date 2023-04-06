import React from 'react'
import Project, { rCanvas } from './Canvas'
import { useFont } from '@shopify/react-native-skia'
import Background from './Background'

const boldTf = require('../../assets/fonts/Roboto-Bold.ttf')
const regularTf = require('../../assets/fonts/Roboto-Regular.ttf')

const projects: rCanvas[] = [
  {
    id: 'id1',
    title: 'C',
    size: '45MB',
    duration: '1:06m',
    picture: require('../../assets/images/IMG_5351.jpeg'),
    color: '#BDA098',
  },
  {
    id: 'id2',
    title: 'B',
    size: '1GB',
    duration: '5:02m',
    picture: require('../../assets/images/IMG_5352.jpeg'),
    color: '#59659a',
  },
  {
    id: 'id3',
    title: 'C',
    size: '500MB',
    duration: '11:04m',
    picture: require('../../assets/images/IMG_5353.jpeg'),
    color: '#BAB9B0',
  },
]

function Riveo() {
  let titleFont = useFont(boldTf, 36)
  let normalFont = useFont(regularTf, 18)
  if (!titleFont || !normalFont) {
    return null
  }
  return (
    <Background>
      {projects.map((project, index) => (
        <Project
          key={index}
          font={titleFont}
          smallFont={normalFont}
          project={project}
        />
      ))}
    </Background>
  )
}

export default Riveo
