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
  user: 'postgres', // Nom d'utilisateur PostgreSQL
  host: 'trial.crcke0iwou72.eu-north-1.rds.amazonaws.com', // Adresse RDS
  database: 'tremblement_de_terre', // Nom de la base de données
  password: 'Mimiimane123++', // Mot de passe PostgreSQL
  port: 5432, // Port PostgreSQL
});

// Connexion à PostgreSQL
client.connect()
  .then(() => {
    console.log('Connexion à PostgreSQL réussie!');
  })
  .catch((err) => {
    console.error('Erreur de connexion à PostgreSQL :', err.stack);
  });

// Route pour vérifier que le backend fonctionne
app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend de votre application!');
});

// Route pour exécuter une requête SQL
app.post('/api/query', async (req, res) => {
  const query = req.body.query;

  // Vérification si la requête SQL est présente dans le corps
  if (!query) {
    return res.status(400).json({ error: 'La requête SQL est requise dans le corps de la requête' });
  }

  try {
    const result = await client.query(query);
    res.json(result.rows); // Renvoie les résultats de la requête SQL
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête SQL :', err.stack);
    res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête SQL' });
  }
});

// Gestion des routes non définies
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrer le serveur Node.js
app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur backend lancé sur http://13.60.84.6:${port}`);
});
