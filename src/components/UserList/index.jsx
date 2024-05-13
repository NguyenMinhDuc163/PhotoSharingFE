import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText } from "@mui/material";
import { fetchModel } from "../../lib/fetchModelData";
import { path } from "../../path";
import "./styles.css"

const UserList = ({ updateUsers }) => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await fetchModel(`${path}api/user/list`);
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, [updateUsers]);

  if (!users) {
    return <ListItem>Loading...</ListItem>;
  }
  return (
    <List component="nav" className="list">
      {users.map((user) => (
        <ListItem to={`/users/${user._id}`} component={Link} key={user._id} divider className="list-item" > 
          <ListItemText primary={user.first_name + " " + user.last_name} />
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;