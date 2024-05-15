
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { path } from "../../path";

const TopBar = ({ auth, setAuth }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [context, setContext] = useState('');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const token = localStorage.getItem('token');
  const fetchUserData1 = async () => {
    const response = await fetch(`${path}api/user/${user._id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }

    });

    const data = await response.json();

    setContext(`Welcome ${data.first_name} ${data.last_name}`);

  }
  useEffect(() => {

    if (token && user) {
      let userId;
      if (pathname.includes("/user")) {
        userId = pathname.split("/").pop();
      } else if (pathname.includes("/photos")) {
        userId = pathname.split("/")[2];
      }
      const fetchUserData = async () => {
        const response = await fetch(`${path}api/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          if(userId){


            const data = await response.json();

            if (pathname.includes("/photos")) {
              setContext(`Photos of ${data.first_name} ${data.last_name}`);
            }
            if (pathname.includes("/user")) {
              setContext(`Details of ${data.first_name} ${data.last_name}`);
            }



          }
        } else {
          // console.log(user._id);


          // console.log("user");
          // setContext(`Welcome ${user.first_name} `);
          // console.log(user.first_name);
          if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setAuth({ loggedIn: false, user: null });
            navigate("/login");
          }
        }
      };
      fetchUserData();
      fetchUserData1();
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ loggedIn: false, user: null });
    setContext('');
    navigate("/login");
  };

  return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" color="inherit" style={{ flexGrow: 1 }}>
            Photo Sharing  {context}
          </Typography>
          {user && (
              <>
                <Button color="inherit" component={Link} to={`/upload-photo`}>
                  Add Photo
                </Button>
                <Button color="inherit" component={Link} to={`/profile/${user._id}`}>
                  Profile
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
          )}
        </Toolbar>
      </AppBar>
  );
};

export default TopBar;