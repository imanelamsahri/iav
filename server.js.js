const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for frontend requests
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// PostgreSQL database connection configuration
const client = new Client({
  user: 'postgres', // Votre nom d'utilisateur PostgreSQL
  host: 'trial.crcke0iwou72.eu-north-1.rds.amazonaws.com', // Point de terminaison de votre base de données RDS
  database: 'tremblement_de_terre', // Nom de votre base de données
  password: 'Mimiimane123++', // Remplacez par votre mot de passe
  port: 5432, // Le port par défaut pour PostgreSQL
});

// Connexion à PostgreSQL
client.connect()
  .then(() => {
    console.log('Connexion à PostgreSQL réussie!');
  })
  .catch((err) => {
    console.error('Erreur de connexion à PostgreSQL', err.stack);
  });

// Exemple de route pour exécuter une requête SQL
app.post('/api/query', async (req, res) => {
  const query = req.body.query;

  // Vérification si la requête est présente dans le corps de la requête
  if (!query) {
    return res.status(400).json({ error: 'La requête SQL est requise dans le corps de la requête' });
  }

  try {
    const result = await client.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête SQL', err.stack);
    res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête SQL' });
  }
});

// Démarrer le serveur Node.js
app.listen(port, '0.0.0.0', () => {  // L'adresse "0.0.0.0" permet d'accepter des connexions de n'importe où
  console.log(`Serveur backend lancé sur http://0.0.0.0:${port}`);
});
