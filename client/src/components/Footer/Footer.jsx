import { motion } from 'framer-motion';
import './Footer.css';

function Footer() {
  return (
    <footer className="home-footer">
      <img src="../../assets/user.jpg" alt="Computer Left" className="computer left" />
      <motion.img
        src="../../assets/user.jpg"
        alt="Mail"
        className="mail"
        animate={{ x: ["0%", "50%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "loop" }}
      />
      <img src="../../assets/user.jpg" alt="Computer Right" className="computer right" />
    </footer>
  );
}

export default Footer;
