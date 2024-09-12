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
      <section className="image-gallery">
        <h2 className="section-title">Project Images</h2>
        <div className="gallery">
          <img src="/path-to/image1.png" alt="Feature 1" className="gallery-img" />
          <img src="/path-to/image2.png" alt="Feature 2" className="gallery-img" />
        </div>
      </section>
    </div>
  );
};

export default Home;