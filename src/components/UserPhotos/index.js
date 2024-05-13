import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  List,
  Divider,
  Typography,
  Grid,
  Avatar,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { fetchModel } from "../../lib/fetchModelData";
import { path } from "../../path";
import "./styles.css";
const UserPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState({});
  const [editCommentId, setEditCommentId] = useState(null); // State to track which comment is being edited
  const [editCommentText, setEditCommentText] = useState(""); // State to hold the new comment text during editing
  const { userId } = useParams();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [editTitleId, setEditTitleId] = useState(null);
  const [editTitleText, setEditTitleText] = useState("");

  useEffect(() => {
    fetchUserDataAndPhotos();
  }, [userId]);

  const fetchUserDataAndPhotos = async () => {
    const userPhotos = await fetchModel(
      `${path}api/photo/photosOfUser/${userId}`
    );
    const userInfo = await fetchModel(`${path}api/user/${userId}`);
    setPhotos(userPhotos || []);
    setUser(userInfo);
    setComments(
      userPhotos
        ? userPhotos.reduce((acc, photo) => ({ ...acc, [photo._id]: "" }), {})
        : {}
    );
  };
  const handleAddComment = async (photoId) => {
    const commentText = comments[photoId];
    if (!commentText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    const commentData = {
      comment: commentText,
    };

    const response = await fetch(
      `${path}api/photo/commentsOfPhoto/${photoId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      }
    );

    if (response.ok) {
      await fetchUserDataAndPhotos(); // Refresh photos and user data after comment is added
      setComments({ ...comments, [photoId]: "" }); // Clear the comment input after successful submission
    } else {
      alert("Failed to post comment");
    }
  };
  const handleDeleteComment = async (photoId, commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      const response = await fetch(
        `${path}api/photo/commentsOfPhoto/photo/${photoId}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        alert("Comment deleted successfully");
        fetchUserDataAndPhotos();
      } else {
        alert("Failed to delete comment");
      }
    }
  };

  const handleEditComment = (photoId, commentId, commentText) => {
    setEditCommentId(commentId);
    setEditCommentText(commentText);
  };

  const handleUpdateComment = async (photoId) => {
    if (!editCommentText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    const response = await fetch(
      `${path}api/photo/commentsOfPhoto/photo/${photoId}/comment/${editCommentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: editCommentText }),
      }
    );

    if (response.ok) {
      alert("Comment updated successfully");
      setEditCommentId(null);
      setEditCommentText("");
      fetchUserDataAndPhotos();
    } else {
      alert("Failed to update comment");
    }
  };
  const handleCancelEdit = () => {
    setEditCommentId(null);
    setEditCommentText("");
    setEditTitleId(null);
    setEditTitleText("");
  };
  const handleDeletePhoto = async (photoId) => {
    if (window.confirm("Are you sure you want to delete this photo?")) {
      const response = await fetch(`${path}api/photo/${photoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Photo deleted successfully");
        fetchUserDataAndPhotos();
      } else {
        alert("Failed to delete photo");
      }
    }
  };
  const handleUpdateTitle = async (photoId) => {
    if (!editTitleText.trim()) {
      alert("Title cannot be empty");
      return;
    }

    const response = await fetch(`${path}api/photo/editPhoto/${photoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editTitleText }),
    });

    if (response.ok) {
      alert("Title updated successfully");
      setEditTitleId(null);
      setEditTitleText("");
      fetchUserDataAndPhotos(); // Refresh the photos and user data
    } else {
      alert("Failed to update title");
    }
  };

  const handleCommentChange = (photoId, value) => {
    setComments({ ...comments, [photoId]: value });
  };
  return (
    <Grid container spacing={3} justifyContent="center">
      {photos.length === 0 ? (
        <>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              style={{ textAlign: "center", margin: "20px" }}
            >
              No photos available. Please upload some images.
            </Typography>
          </Grid>
        </>
      ) : (
        <>
          {photos.map((photo) => (
            <Grid item xs={12} sm={8} key={photo._id}>
              <Card variant="outlined" className="user-photo-card">
                <CardHeader
                  title={
                    <Link to={`/users/${user._id}`} className="user-link">
                      {`${user.first_name} ${user.last_name}`}
                    </Link>
                  }
                  subheader={new Date(photo.date_time).toLocaleString()}
                  avatar={
                    user && (
                      <Avatar
                        className="avatar"
                        style={{ backgroundColor: "#FF7F50" }}
                      >
                        {user.first_name[0]}
                        {user.last_name[0]}
                      </Avatar>
                    )
                  }
                />
                {editTitleId === photo._id ? (
                <>
                  <TextField
                    fullWidth
                    margin="dense"
                    value={editTitleText}
                    onChange={(e) => setEditTitleText(e.target.value)}
                  />
                  <IconButton
                  className="edit-title-button"
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateTitle(photo._id)}
                    style={{ margin: "5px" }}
                  >
                    Save
                  </IconButton>
                  <IconButton
                  className="edit-title-button"
                    variant="contained"
                    onClick={() => {
                      setEditTitleId(null);
                      setEditTitleText("");
                    }}
                    style={{ margin: "5px" }}
                  >
                    Cancel
                  </IconButton>
                </>
                ) : (
                <>
                  <Typography variant="h6">{photo.title}</Typography>
                  {photo.user_id === currentUser._id && (
                    <IconButton
                    className="edit-title-button"
                      onClick={() => {
                        setEditTitleId(photo._id);
                        setEditTitleText(photo.title);
                      }}
                      style={{ marginLeft: "10px" }}
                    >
                      Edit
                    </IconButton>
                  )}
                </>
                ) }
                <CardMedia
                  component="img"
                  image={
                    photo.file_name
                      ? `${path}uploads/${photo.file_name}`
                      : undefined
                  }
                  alt={photo.file_name}
                  className="card-media"
                />
                <CardContent>
                  <Typography variant="subtitle1">Comments:</Typography>
                  <Divider />
                  {photo.comments.map((c) => (
                    <List key={c._id} className="comment-list">
                      <Typography variant="subtitle2">
                        <Link to={`/users/${c.user_id}`} className="user-link">
                          {`${c.user.first_name} ${c.user.last_name}`}
                        </Link>
                      </Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        gutterBottom
                      >
                        {new Date(c.date_time).toLocaleString()}
                      </Typography>
                      {editCommentId === c._id ? (
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          className="edit-comment-textfield"
                        />
                      ) : (
                        <Typography
                          variant="body1"
                          className="comment-body"
                        >{`"${c.comment}"`}</Typography>
                      )}
                      {c.user_id === currentUser._id && (
                        <IconButton
                          onClick={() =>
                            handleEditComment(photo._id, c._id, c.comment)
                          }
                          className="edit-button"
                        >
                          Edit
                        </IconButton>
                      )}
                      {(c.user_id === currentUser._id ||
                        photo.user_id === currentUser._id) && (
                        <IconButton
                          onClick={() => handleDeleteComment(photo._id, c._id)}
                          className="delete-button"
                        >
                          Delete
                        </IconButton>
                      )}
                      {editCommentId === c._id && (
                        <>
                          <IconButton
                            onClick={() => handleUpdateComment(photo._id)}
                            className="save-button"
                          >
                            Save
                          </IconButton>
                          <IconButton
                            onClick={() => handleCancelEdit()}
                            className="cancel-button"
                          >
                            Cancel
                          </IconButton>
                        </>
                      )}
                    </List>
                  ))}
                  <TextField
                    label="Add a comment"
                    variant="outlined"
                    fullWidth
                    value={comments[photo._id]}
                    onChange={(e) =>
                      handleCommentChange(photo._id, e.target.value)
                    }
                    margin="normal"
                    className="add-comment-textfield"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddComment(photo._id)}
                    className="post-comment-button"
                  >
                    Post Comment
                  </Button>
                  {photo.user_id === currentUser._id && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDeletePhoto(photo._id)}
                        className="delete-photo-button"
                      >
                        Delete Photo
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
};

export default UserPhotos;
