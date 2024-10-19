import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import './Footer.css'

function Footer () {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const startX = -100
  const middleX = screenWidth * 0.45
  const endX = screenWidth * 0.95

  return (
    <footer className='home-footer'>
      <img src='/src/assets/pc.png' alt='Computer Left' className='computer left' />
      <motion.img
        src='/src/assets/mail.png'
        alt='Mail'
        className='mail'
        animate={{ x: [startX, middleX, endX] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
      />
      <img src='/src/assets/server.jpg' alt='server' className='server' style={{ width: '5rem' }} />
      <motion.img
        src='/src/assets/mail.png'
        alt='Mail'
        className='mail'
        animate={{ x: [endX, middleX, startX] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'loop' }}
      />
      <img src='/src/assets/pc2.png' alt='Computer Right' className='computer right' />
      <br />
      <p className='rights'>© 2024 ChatApp. All rights reserved.</p>
    </footer>
  )
}

export default Footer
