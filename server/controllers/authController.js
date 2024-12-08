const bcrypt = require('bcrypt');
const forge = require('node-forge');
const pool = require('../services/db');
const generateToken = require('../services/genToken');

const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!passwordPattern.test(password)) {
            return res.status(403).json({ message: 'Weak password' })
        }
    
        const keyPair = forge.pki.rsa.generateKeyPair(2048);
        const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
    
        const hash = await bcrypt.hashSync(password, saltRounds);
    
        const encryptedPrivateKey = forge.util.encode64(
            forge.pki.encryptRsaPrivateKey(keyPair.privateKey, hash)
        );
    
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existingUser.length > 0) {
          return res.status(400).json({ message: 'Username already exists' })
        }
        
        await pool.query(
            'INSERT INTO users (username, email, password, role, public_key, encrypted_private_key) VALUES ($1, $2, $3, $4, $5, $6)',
            [username, email, hash, 'user', publicKey, encryptedPrivateKey]
        );
    
        res.status(201).json({ message: 'Account created' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
};

exports.signin = async (req, res) => {
    try {
        const { username, password } = req.body
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = userResult.rows[0];
    
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    
        const privateKeyPem = forge.pki.decryptRsaPrivateKey(
            forge.util.decode64(user.encrypted_private_key),
            user.password
        );
    
        const token = generateToken(user.id, user.username, user.role);
    
        res.status(200).json({ message: 'Sign in successful', token, username: user.username, privateKey: forge.pki.privateKeyToPem(privateKeyPem) })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
};
