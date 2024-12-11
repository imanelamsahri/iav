const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 3000;

// Certificat SSL (Assurez-vous de placer vos fichiers certificat dans un dossier accessible)
const options = {
  key: fs.readFileSync('/path/to/your/privkey.pem'),
  cert: fs.readFileSync('/path/to/your/fullchain.pem')
};

// Enable CORS for frontend requests
app.use(cors({ origin: 'https://your-frontend-domain.com' }));

// Parse incoming JSON requests
app.use(express.json());

// PostgreSQL database connection configuration
const client = new Client({
  user: 'postgres',
  host: 'trial.crcke0iwou72.eu-north-1.rds.amazonaws.com',
  database: 'tremblement_de_terre',
  password: 'Mimiimane123++',
  port: 5432,
});

// Connexion à PostgreSQL
client.connect()
  .then(() => {
    console.log('Connexion à PostgreSQL réussie!');
  })
  .catch((err) => {
    console.error('Erreur de connexion à PostgreSQL', err.stack);
  });

// Exemple de route sécurisée pour exécuter une requête SQL
app.post('/api/query', async (req, res) => {
  const query = req.body.query;

  // Vérifiez que seules les requêtes SELECT sont autorisées
  if (!query || !query.trim().toLowerCase().startsWith('select')) {
    return res.status(400).json({ error: 'Seules les requêtes SELECT sont autorisées.' });
  }

  try {
    const result = await client.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête SQL', err.stack);
    res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête SQL' });
  }
});

// Démarrer le serveur Node.js avec HTTPS
https.createServer(options, app).listen(port, '0.0.0.0', () => {
  console.log(`Serveur backend lancé sur https://0.0.0.0:${port}`);
});
