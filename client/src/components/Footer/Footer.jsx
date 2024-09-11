import { motion } from 'framer-motion';
import './Footer.css';

function Footer() {
  return (
    <footer className="home-footer">
      <h2 className='logo-text'>Footer here</h2>
      <img src="../../assets/pc.png" alt="Computer Left" className="computer left" />
      <motion.img
        src="../../assets/pc.png"
        alt="Mail"
        className="mail"
        animate={{ x: ["0%", "50%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "loop" }}
      />
      <img src="../../assets/pc.png" alt="Computer Right" className="computer right" />
    </footer>
  );
}

export default Footer;
