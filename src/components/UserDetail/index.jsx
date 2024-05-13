import React, { useState, useEffect } from 'react';
import {Grid, Typography, Button} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import { Link } from "react-router-dom";
import {useParams} from "react-router-dom";
import { fetchModel } from '../../lib/fetchModelData';
import { path } from '../../path';
import './styles.css';

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
      const fetchUser = async () => {
          try {
              const userData =  await fetchModel(`${path}api/user/${userId}`)
              
              setUser(userData);
          } catch (error) {
              console.error('Error fetching user:', error);
          }
      };

      fetchUser();
  }, [userId]);
  return (
    <Grid container className="user-detail">
    <Grid item xs={12} className="user-detail-item">
     
      <Typography color="textSecondary" className="user-detail-label"> <PersonIcon /> Name:</Typography>
      <Typography variant="h6" gutterBottom className="user-detail-value">
        {user && `${user.first_name} ${user.last_name}`}
      </Typography>
      
      <Typography color="textSecondary" className="user-detail-label"><DescriptionIcon /> Description:</Typography>
      <Typography variant="h6" gutterBottom className="user-detail-value">
        {user && `${user.description}`}
      </Typography>
      
      <Typography color="textSecondary" className="user-detail-label"><LocationOnIcon /> Location:</Typography>
      <Typography variant="h6" gutterBottom className="user-detail-value">
        {user && `${user.location}`}
      </Typography>
      
      <Typography color="textSecondary" className="user-detail-label"><WorkIcon /> Occupation:</Typography>
      <Typography variant="h6" gutterBottom className="user-detail-value">
        {user && `${user.occupation}`}
      </Typography>
    </Grid>
        <Grid item xs={4} />
        <Grid item xs={4}>
            <Button
                size="large"
                to={user && `/photos/${user._id}`}
                component={Link}
                variant="contained"
                color="primary"
            >
                See Photos
            </Button>
        </Grid>
        <Grid item xs={4} />
    </Grid>
);
}

export default UserDetail;