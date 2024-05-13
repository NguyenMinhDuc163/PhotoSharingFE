// App.js
import './App.css';

import React, { useState } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from './components/Profile';
import UploadPhoto from './components/UploadFile';
import { fetchModel } from './lib/fetchModelData';
import { path } from './path';

const App = (props) => {
  const [auth, setAuth] = useState({
    loggedIn: !!localStorage.getItem('token'),
    user: null
  });
  const [users, setUsers] = useState([]);

const updateUsers = async () => {
  const updatedUsers = await fetchModel(`${path}user/list`);
  setUsers(updatedUsers);
}
  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar auth={auth} setAuth={setAuth} />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              {auth.loggedIn ? <UserList users={users} updateUsers={updateUsers}  /> : <Typography>Please log in to see the user list.</Typography>}
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                {auth.loggedIn ? (
                  <>
                   <Route path="/profile/:userId" element={<Profile auth={auth} setAuth={setAuth} updateUsers={updateUsers} />} />
                    <Route path="/users/:userId" element={<UserDetail />} />
                    <Route path="/photos/:userId" element={<UserPhotos />} />
                    <Route path="/upload-photo" element={<UploadPhoto />} />  
                    <Route path="/users" element={<UserList />} />
                  </>
                ) : (
                  <>
                    <Route path="/login" element={<Login setAuth={setAuth} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                    <Route path="/register" element={<Register />} />
                  </>
                )}
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
