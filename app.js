const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
app.use(express.json());

const posts = require("./data/posts.json");
const comments = require("./data/comments.json");
// Fonctions utilitaires pour lire/écrire des fichiers JSON à placer ici
const postPath = path.join(__dirname, "./data/posts.json");
const comPath = path.join(__dirname, "./data/comments.json");
const readJson = (path) => JSON.parse(fs.readFileSync(path, "utf8"));

// Test de démarrage
app.get("/", (req, res) => {
  res.send("Bienvenue sur l’API du mini-blog !");
});

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
  console.log("ici 1");

  if (!newPost.title || !newPost.content) {
    res.status(400).send("Manque le titre ou le content");
  }

  try {
    console.log("ici 2");

    const posts = readJson(postPath);
    console.log("ici 3");
    // const nextId = posts[posts.length - 1].id + 1;
    const nextId = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1;

    console.log("Prochain ID :", nextId);

    let postToAdd = {
      id: nextId,
      title: newPost.title,
      content: newPost.content,
      author: newPost.author,
    };
    console.log("ici 5");

    posts.push(postToAdd);
    console.log("ici 6");

    writeJson(postPath, posts);
    console.log("ici 7");

    res.status(201).json(postToAdd);
  } catch (err) {
    res.status(201).send("erreur");
    console.log("erreur");
  }
});

// Modifier un element

app.patch("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const { titre } = req.body;

  if (!titre) {
    return res.status(400).json({ message: "Titre manquant" });
  }
  const posts = readJson(postPath);
  const index = posts.findIndex((p) => p.id === postId);

  if (index === -1) {
    return res.status(404).json({ message: "Post non trouvé" });
  }

  posts[index].title = titre;

  // writeJson(postPath, posts);
  fs.writeFile(postPath, JSON.stringify(posts, null), (err) => {
    if (err) {
      console.error("erreur lors de la lecture", err);
      return res.status(500).json({ message: "Erreurs serveur" });
    }
    res.json({ post: posts[index] });
  });
});

app.delete("/post/:id", (req, res) => {
  const postId = parseInt(req.params.id);

  posts.splice(postId - 1, 1);
  // ! Faire gaffe je mets jamais le bon je mets toujours slice et non splice

  fs.writeFileSync(postPath, JSON.stringify(posts));
  res.status(204).end();
});

app.get("/posts/:id/comments", (req, res) => {
  const postId = parseInt(req.params.id);

  try {
    const comments = readJson(comPath);
    const commentsDupost = comments.filter((c) => c.postId === postId);
    res.json(commentsDupost);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la lecture " });
  }
});





app.post("/posts/:id/comments", (req, res) => {
  const newComment = req.body;
  console.log("ici 1");
  if (!newComment.content || !newComment.author) {
    res.status(400).send("il nous manque sois le contenu sois l'author");
  }

  try {
    console.log("ici 2");

    const comments = readJson(comPath);

    const nextId =
      comments.length > 0 ? comments[comments.length - 1].id + 1 : 1;

    console.log("Prochain ID :", nextId);

    let comToAdd = {
      id: nextId,
      idpost: newComment.postId,
      author: newComment.author,
      content: newComment.content,
    };
    console.log("ici 5");

    comments.push(comToAdd);
    console.log("ici 6");

    writeJson(comPath, comments);
    console.log("ici 7");
  } catch (err) {
    res.status(201).send("erreur");
    console.log("erreur");
  }


  //  ? je m'attendais a devoir prendre la donée du post 

});
// Lancement du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
