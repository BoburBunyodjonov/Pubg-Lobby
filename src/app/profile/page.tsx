"use client";

import { useState, useEffect } from "react";
import { auth, realTimeDB } from "../../data/firebase"; // Ensure correct import
import { ref, onValue, push, set, update } from "firebase/database";
import { User } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Box,
} from "@mui/material";
import Layout from "@/components/Layout";
import { logoutUser } from "@/data/firebaseUtils";

// Define Message interface
interface Message {
  content: string;
  timestamp: number;
}

// Define UserData interface
interface UserData {
  email: string;
  name: string;
  phone: string;
  password: string;
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchMessages(user.uid);
        fetchUserData(user.uid);
      } else {
        window.location.href = "/login"; // Redirect to login
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchMessages = (userId: string) => {
    const messagesRef = ref(realTimeDB, `messages/${userId}`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the object into an array of messages
        const messagesArray: Message[] = Object.values(data);
        setMessages(messagesArray);
      } else {
        setMessages([]); // If no data, clear the messages
      }
    });
  };

  const fetchUserData = (userId: string) => {
    const userRef = ref(realTimeDB, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserData({
          email: data.email,
          name: data.name,
          phone: data.phone,
          password: data.password,
        });
      }
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    if (user) {
      const messagesRef = ref(realTimeDB, `messages/${user.uid}`);
      const newMessageRef = push(messagesRef);
      const messageData = {
        content: newMessage,
        timestamp: Date.now(),
      };

      // Ensure messageData is properly defined
      console.log("Sending message:", messageData);

      set(newMessageRef, messageData)
        .then(() => {
          toast.success("Message sent successfully");
          setNewMessage("");
        })
        .catch((error) => {
          toast.error("Error sending message:", error);
        });
    } else {
      toast.error("User is not authenticated.");
    }
  };

  const handleUpdateUserData = () => {
    if (user && userData) {
      const userRef = ref(realTimeDB, `users/${user.uid}`);
      update(userRef, userData)
        .then(() => {
          console.log("User data updated successfully");
          toast.success("User data updated successfully");
          setEditMode(false);
        })
        .catch((error) => {
          toast.error("Error updating user data:", error);
        });
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      if (typeof window !== "undefined") {
        localStorage.removeItem("userRegister");  
        window.location.href = "/login";  
      }
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <Layout>
      <Container className="pt-20">
        <ToastContainer />
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant="h4" fontWeight={700} component="h1" gutterBottom>
          User Profile
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Card variant="outlined" sx={{ marginTop: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={userData?.name || ""}
                  onChange={(e) =>
                    setUserData((prev) =>
                      prev
                        ? { ...prev, name: e.target.value }
                        : {
                            name: e.target.value,
                            email: "",
                            phone: "",
                            password: "",
                          }
                    )
                  }
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={userData?.email || ""}
                  onChange={(e) =>
                    setUserData((prev) =>
                      prev
                        ? { ...prev, email: e.target.value }
                        : {
                            email: e.target.value,
                            name: "",
                            phone: "",
                            password: "",
                          }
                    )
                  }
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  value={userData?.phone || ""}
                  onChange={(e) =>
                    setUserData((prev) =>
                      prev
                        ? { ...prev, phone: e.target.value }
                        : {
                            phone: e.target.value,
                            name: "",
                            email: "",
                            password: "",
                          }
                    )
                  }
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  value={userData?.password || ""}
                  onChange={(e) =>
                    setUserData((prev) =>
                      prev
                        ? { ...prev, password: e.target.value }
                        : {
                            password: e.target.value,
                            phone: "",
                            name: "",
                            email: "",
                          }
                    )
                  }
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
            {editMode ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateUserData}
                sx={{ marginTop: 2 }}
              >
                Save Changes
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setEditMode(true)}
                sx={{ marginTop: 2 }}
              >
                Edit Profile
              </Button>
            )}
            <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
              Messages
            </Typography>
            <List>
              {messages.map((msg, index) => (
                <div key={index}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <span>
                          {msg.content
                            .split(/(https?:\/\/[^\s]+)/g)
                            .map((part, i) =>
                              part.match(/https?:\/\/[^\s]+/) ? (
                                <a
                                  key={i}
                                  href={part}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline px-4 py-3"
                                >
                                  {part}
                                </a>
                              ) : (
                                part
                              )
                            )}
                        </span>
                      }
                      secondary={new Date(msg.timestamp).toLocaleString()} // Show date and time
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{ marginTop: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              sx={{ marginTop: 2 }}
            >
              Send
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default UserProfile;
