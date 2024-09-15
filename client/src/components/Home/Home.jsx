import React from 'react';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="home-title"
        >
          Welcome to Chato
        </motion.h1>
        <p className="home-description">
          A decentralized and encrypted chat application built with the latest technologies.
          Connect with friends securely and enjoy seamless communication.
        </p>
      </header>
      <section className="tech-section">
        <h2 className="section-title">Technologies Used</h2>
        <div className="tech-list">
          <div className="tech-item">
            <img src="/src/assets/react.svg" alt="React" className="tech-logo" />
            <p>React</p>
          </div>
          <div className="tech-item">
            <img src="/src/assets/nextjs.svg" alt="Next.js" className="tech-logo" />
            <p>Next.js</p>
          </div>
          <div className="tech-item">
            <img src="/src/assets/socket.png" alt="Socket.io" className="tech-logo" />
            <p>Socket.io</p>
          </div>
        </div>
      </section>
      <section className="encryption-section">
        <h2 className="section-title">How Encryption Works</h2>
        <div>
          <p className='home-description'>
            Encryption is the process of converting plain text into ciphertext to protect your messages. This ensures that only the intended recipient can read the message after decrypting it. In our chat app, we use end-to-end encryption, which means that messages are encrypted on your device and only decrypted by the recipient.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;