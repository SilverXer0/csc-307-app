import express from "express";
import cors from "cors";
import userServices from "./user-services.js";


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  //updated to get by name and job if applicable
  const { name, job } = req.query;
  userServices.getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  userServices.findUserById(id)
    .then((result) => {
      if (!result) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

app.delete("/users/:id", (req, res) => {
  // deleting user
  const id = req.params["id"];
  userServices.deleteUserById(id)
    .then((result) => {
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).send("User Not Found");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userServices.addUser(userToAdd)
    .then((addedUser) => {
      res.status(201).json(addedUser);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
