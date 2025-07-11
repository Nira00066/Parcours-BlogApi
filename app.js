const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
app.use(express.json());

const posts = require("./data/posts.json");
const comments = require("./data/comments.json");
// Fonctions utilitaires pour lire/écrire des fichiers JSON à placer ici
const postPath = path.join(__dirname, "./data/posts.json");
// Test de démarrage
app.get("/", (req, res) => {
  res.send("Bienvenue sur l’API du mini-blog !");
});

const readJson = (path) => {
  const raw = fs.readFileSync(path, "utf-8");
  return JSON.parse(raw);
};

const writeJson = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

const afficherFichier = (cheminFichier) => {
  try {
    const data = readJson(cheminFichier);
    console.log("contenu du fichier");
    console.log(data);
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier :", error.message);
  }
};
// afficherFichier(path.join(__dirname, "./data/posts.json"));

afficherFichier(postPath);
// Routes à compléter ici
// routes pour toutes les postes
app.get("/posts", (req, res) => {
  try {
    const posts = readJson(postPath);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la lecture " });
  }
});
// postes par id
app.get("/post/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((f) => f.id === id);
  if (!post) {
    return res.status(404).json({ message: "film pas trouvée" });
  }
  res.json(post);
});

app.post("/posts", (req, res) => {
  const newPost = req.body;
  if (!newPost.title || !newPost.content) {
    res.status(400).send("Manque le titre ou le content");
  }

  try {
    const posts = readJson(postPath);

    const nextId = posts.length > posts[posts.length - 1].id + 1;

    const postToAdd = {
      id: nextId,
      title: newPost.title,
      content: newPost.content,
    };
    posts.push(postToAdd);
    writeJson(postPath, posts);
    res.status(201).json(postToAdd);

    
  } catch (err) {
    res.status(201).send("erreur");
    console.log("erreur");
  }
});

// Lancement du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
