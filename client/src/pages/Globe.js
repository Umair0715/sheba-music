import React from 'react'
import React3dEarth from 'react-3d-earth'
const Globe = () => {
  return (
    <React3dEarth
        style={{width: '100%', height: '100vh',position:'absolute',zIndex:'0'}}
        config={{
          radius: 30,
          mobileRadius: 20,
          backgroundColor: '#fafafa',
          flagScale:1,
          flagLat:39.56,
          flagLon: 116.20,
          flagColor: 'green', 
          dotColor: 'hotpink',
          autoRotationSpeed: 3,
          draggingRotationSpeed:5,
          textureSrc: '/logo192.png'
        }}/>
  )
}

export default Globe