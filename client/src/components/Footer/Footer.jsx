import { motion } from 'framer-motion';
import './Footer.css';

function Footer() {
  return (
    <footer className="home-footer">
      <img src="/src/assets/pc.png" alt="Computer Left" className="computer left" />
      <motion.img
        src="/src/assets/mail.png"
        alt="Mail"
        className="mail"
        animate={{ x: ["50%", "1500%", "2800%"] }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
      />
      <img src="/src/assets/pc.png" alt="Computer Right" className="computer right" />
    </footer>
  );
}

export default Footer;
