import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(_id, index) {
    fetch(`http://localhost:8000/users/${_id}`, {
      method: 'DELETE'
    })
    .then((response) => {
      if (response.status === 204) {
        // Successful delete
        // Remove the deleted user from the state using the index
        const updatedCharacters = [...characters];
        updatedCharacters.splice(index, 1);
        setCharacters(updatedCharacters);
      } else if (response.status === 404) {
        // User not found
        console.log("User not found");
      } else {
        // Handle other status codes if needed
        console.log("Error deleting user");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle error
    });
  }

  function updateList(person) { 
    postUser(person)
    .then((response) => {
      if (response.status === 201) {
        return response.json(); 
      } else {
        throw new Error("User not Added - Status: " + response.status);
      }
    })
    .then((addedUser) => {
      setCharacters([...characters, addedUser]);
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle error, show error message to the user, etc.
    });
}

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}
export default MyApp;
