import express from "express";
import cors from "cors";

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const findUsersByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user.name === name && user.job === job
  );
};
// simple random id generator
/* const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9);
};
*/

// just for fun, I changed the generateRandomId function to conform to the given standard in the example data.

const generateRandomId = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  let randomId = "";

  for (let i = 0; i < 3; i++) {
    randomId += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  for (let i = 0; i < 3; i++) {
    randomId += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return randomId;
};

const addUser = (user) => {
  const newUser = { id: generateRandomId(), ...user };
  users["users_list"].push(newUser);
  return newUser;
};

const deleteUserById = (id) => {
  // delete user
  const index = users["users_list"].findIndex((user) => user["id"] == id);
  if (index !== -1) {
    users["users_list"].splice(index, 1);
    return true;
  }
  return false;
};

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  //updated to get by name and job if applicable
  const { name, job } = req.query;
  if (name && job) {
    let result = findUsersByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else if (name) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.delete("/users/:id", (req, res) => {
  // deleting user
  const id = req.params["id"];
  let result = deleteUserById(id);
  if (result) {
    // successful delete = no content
    res.status(204).send();
  } else {
    res.status(404).send("User Not Found");
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const addedUser = addUser(userToAdd);
  res.status(201).json(addedUser);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
