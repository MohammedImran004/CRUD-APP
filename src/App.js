import './App.css';
import { useEffect, useState } from 'react';
import { Button , EditableText, InputGroup, Toaster } from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: 'top-center',
});

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  function onChangeHandler(id, key, value) {
    setUsers((users) => {
      return users.map(user => {
        return user.id === id ? { ...user, [key]: value } : user;
      });
    });
  }

  function updateUser(id) {
    const user = users.find((user) => user.id === id);  // Find the specific user

    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),  // Send the single updated user
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(data => {
        setUsers(users.map(u => (u.id === id ? data : u)));  // Update the local state with the returned data
        AppToaster.show({
          message: "User Updated Successfully",
          intent: 'success',
          timeout: 3000
        });
      })
      .catch(error => console.error('Error updating user:', error));
  }

  function AddUser() {
    const Name = name.trim();
    const Email = email.trim();
    const Website = website.trim();

    if (Name && Email && Website) {
      fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        body: JSON.stringify({
          name: Name,
          email: Email,
          website: Website
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      })
        .then(response => response.json())
        .then(data => {
          setUsers([...users, data]);
          AppToaster.show({
            message: "User Added Successfully",
            intent: 'success',
            timeout: 3000
          });
          setName("");
          setEmail("");
          setWebsite("");
        })
        .catch(error => console.error('Error adding user:', error));
    }
  }

  return (
    <div className="App">
      <table className="bp4-html-table modifier">
        <thead>
          <tr>
            <th>sno</th>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td><EditableText value={user.id.toString()} /></td>
              <td><EditableText onChange={value => onChangeHandler(user.id, 'name', value)} value={user.name} /></td>
              <td><EditableText onChange={value => onChangeHandler(user.id, 'email', value)} value={user.email} /></td>
              <td><EditableText onChange={value => onChangeHandler(user.id, 'website', value)} value={user.website} /></td>
              <td>
                <Button intent="primary" onClick={() => updateUser(user.id)}>Update</Button><br />
                <Button intent="danger">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter The Name:"
              />
            </td>
            <td>
              <InputGroup
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter The Email:"
              />
            </td>
            <td>
              <InputGroup
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Enter The Website Name:"
              />
            </td>
            <td>
              <Button intent="success" onClick={AddUser}>Add User</Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
