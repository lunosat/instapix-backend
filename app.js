import express from "express";
import {
  createUser,
  findAllUsers,
  findUserByName,
  updateUserByName,
  deleteUserByName,
  findAllPosts,
  createPost,
  findUserByEmail,
} from "./src/database.js";
import dotenv from "dotenv";
import genPass from "./helpers/genPass.js";
import isValidEmail from "./helpers/isValidEmail.js";
import https from 'https'
import fs from 'fs'
dotenv.config();

const standardPass = process.env.STANDARD_PASS;
  
const app = express();
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

// Criar um novo usuário
app.get("/", (req, res) => {
  res.send('<h1>Hello</h1>')
})
app.post("/createUser", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let pass;
    if (password.type === "standard") pass = standardPass || "user123";
    if (password.type === "autogen") pass = genPass(5);
    if (password.type === "define") pass = password.pass;
    if (!pass)
       return res.status(400).send({ status: 400, message: "Error on create user" });
    const user = await createUser(username.toLowerCase(), email, pass);
    res
      .status(201)
      .send({ status: 200, message: "Success on create user", user: user });
  } catch (error) {
    res.status(500).send({ status: 500, message: error.message });
  }
});

// Encontrar todos os usuários
app.get("/users", async (req, res) => {
  try {
    const users = await findAllUsers();
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Encontrar usuário por nome
app.get("/users/:name", async (req, res) => {
  try {
    const user = await findUserByName(req.params.name);
    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Atualizar usuário por nome
app.put("/users/:name", async (req, res) => {
  try {
    const updates = req.body;
    const user = await updateUserByName(req.params.name, updates);
    if (!user) {
      return res.status(404).json({ status: 400, message: "Usuário não encontrado" });
    }
    res.status(200).json({ status: 200, message: "Usuário atualizado com sucesso!", user });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Deletar usuário por nome
app.delete("/users/:name", async (req, res) => {
  try {
    const user = await deleteUserByName(req.params.name);
    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado" });
    }
    res.send({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log(req.body)
    const { username, password } = req.body;
    let user;
    if(isValidEmail(username.toLowerCase())){
      user = await findUserByEmail(username.toLowerCase())
    } else {
      user = await findUserByName(username.toLowerCase());
    }
    if (password === user.password) {
      res.status(200).json({ status: 200, success: true, user: user });
    } else {
      res.status(400).json({ status: 400, success: false, message: "Invalid credentials" });
    }
  } catch (e) {
    res.status(500).json({status: 500, message: e.message})
  }
});
app.post("/createPost", async (req, res) => {
  try {
    const {username, profilePicture, image, likeCount, description, timeAgo} = req.body
    const post = await createPost(username, profilePicture, image, likeCount, description, timeAgo);
    res.status(200).json({status: 200, message: 'poste created', post})
  } catch (e){
    res.status(500).json({status: 500, message: e.message})
  }
})

app.get("/posts", async (req, res) => {
  console.log('REQ: Posts')
  try {
    const posts = await findAllPosts();
    res.status(200).json({status: 200, posts: posts});
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

const options = {
  key: fs.readFileSync('./private.key', 'utf-8'),
  cert: fs.readFileSync('./certificate.crt', 'utf-8'),
  passphrase: '12345678'
};

https.createServer(options, app).listen(process.env.PORT, () => {
  console.log('Server HTTPS started on port:', process.env.PORT)
})

//app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
