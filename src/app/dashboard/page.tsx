"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Avatar,
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import {
  getRegisteredUsers,
  updateGamePermission,
  logoutUser,
  addMap,
  getMaps,
  deleteMap,
  updateMap,
} from "../../data/firebaseUtils";
import { uploadFile } from "@/data/uploadFile";
import { GameMap } from "@/types/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  phone: number;
  isOnline: boolean;
  hasGamePermission: boolean;
}

interface Map {
  id: string;
  name: string;
  imageUrl: string;
  gameStartDate: string;
  telegramLink: string;
  gameStartTime: string;
  playersNumber: string;
}

export default function DashboardPage() {
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [maps, setMaps] = useState<Map[]>([]);
  const [newMapName, setNewMapName] = useState("");
  const [gameStartDate, setGameStartDate] = useState("");
  const [gameStartTime, setGameStartTime] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [playersNumber, setPlayersNumber] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editMap, setEditMap] = useState<Map | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  if (!localStorage.getItem("Admin")) {
    window.location.href = "/";
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getRegisteredUsers();
        setRegisteredUsers(users);

        const fetchedMaps = await getMaps();
        setMaps(fetchedMaps);
      } catch (error) {
        console.error("Error fetching dashboard data: ", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePermissionToggle = async (
    userId: string,
    newPermission: boolean
  ) => {
    try {
      await updateGamePermission(userId, newPermission);
      setRegisteredUsers((users) =>
        users.map((user) =>
          user.id === userId
            ? { ...user, hasGamePermission: newPermission }
            : user
        )
      );
    } catch (error) {
      console.error("Error updating game permission: ", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log(`Selected file: ${file.name}`);
    } else {
      setSelectedFile(null);
    }
  };

  const capitalizeFirstLetter = (text: string) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };
  
  const formattedPlayersNumber = capitalizeFirstLetter(playersNumber);

  const handleAddMap = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (selectedFile) {
      try {
        const imageUrl = await uploadFile(selectedFile);
        if (imageUrl) {
          // Capitalize the first letter of playersNumber
  
          await addMap(
            newMapName,
            imageUrl,
            gameStartDate,
            telegramLink,
            gameStartTime,
            formattedPlayersNumber
          );
  
          const newMap: Map = {
            id: uuidv4(), // Generate a unique ID
            name: newMapName,
            imageUrl,
            gameStartDate,
            telegramLink,
            gameStartTime,
            playersNumber: formattedPlayersNumber, // Use formatted value
          };

          // Update the maps state and clear form fields
          setMaps((prevMaps) => [...prevMaps, newMap]);
          setNewMapName("");
          setGameStartDate("");
          setTelegramLink("");
          setGameStartTime("");
          setPlayersNumber("");
          setSelectedFile(null); // Reset the selected file
  
          // Show success notification
          toast.success("Map added successfully!");
        } else {
          console.error("Failed to get image URL");
        }
      } catch (error) {
        console.error("Error adding new map: ", error);
        toast.error("Failed to add map.");
      }
    } else {
      console.error("No file selected");
      toast.error("Please select a file.");
    }
  };

  const handleEditMap = (map: Map) => {
    setEditMap(map);
    setNewMapName(map.name);
    setGameStartDate(map.gameStartDate);
    setGameStartTime(map.gameStartTime);
    setTelegramLink(map.telegramLink);
    setPlayersNumber(formattedPlayersNumber)
    setOpenEditDialog(true);
  };

  const handleUpdateMap = async (e: React.FormEvent) => {
    e.preventDefault(); 

    if (editMap) {
      try {
        let imageUrl = editMap.imageUrl;
        if (selectedFile) {
          imageUrl = await uploadFile(selectedFile);
          if (!imageUrl) {
            console.error("Failed to get image URL");
            return;
          }
        }

        await updateMap(editMap.id, {
          ...editMap,
          name: newMapName || editMap.name,
          imageUrl,
          gameStartDate: gameStartDate || editMap.gameStartDate,
          gameStartTime: gameStartTime || editMap.gameStartTime,
          telegramLink: telegramLink || editMap.telegramLink,
          playersNumber: formattedPlayersNumber || editMap.playersNumber,
          

        });

        setMaps((prevMaps) =>
          prevMaps.map((map) =>
            map.id === editMap.id
              ? {
                  ...map,
                  name: newMapName || map.name,
                  imageUrl,
                  gameStartDate: gameStartDate || map.gameStartDate,
                  gameStartTime: gameStartTime || map.gameStartTime,
                  telegramLink: telegramLink || map.telegramLink,
                  playersNumber: formattedPlayersNumber || map.playersNumber,
                }
              : map
          )
        );

        setEditMap(null);
        setNewMapName("");
        setGameStartDate("");
        setGameStartTime("");
        setPlayersNumber("");
        setTelegramLink("");
        setSelectedFile(null);
        setOpenEditDialog(false);

        toast.success("Map updated successfully!");
      } catch (error) {
        console.error("Error updating map: ", error);
        toast.error("Failed to update map.");
      }
    } else {
      console.error("No map to update");
    }
  };
  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const handleDeleteMap = async (id: string) => {
    try {
      await deleteMap(id);
      setMaps(maps.filter((map) => map.id !== id));

      // Show success notification
      toast.success("Map deleted successfully!");
    } catch (error) {
      console.error("Error deleting map: ", error);
      toast.error("Failed to delete map.");
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 0" }}>
      <ToastContainer />
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        style={{ marginBottom: "32px" }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Grid>

      <Grid container spacing={3} style={{ marginBottom: "32px" }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Registered Users" />
            <CardContent>
              <Typography variant="h3" component="div" fontWeight="bold">
                {registeredUsers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Online Users" />
            <CardContent>
              <Typography variant="h3" component="div" fontWeight="bold">
                {registeredUsers.filter((user) => user.isOnline).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card style={{ marginBottom: "32px" }}>
        <CardHeader title="User Management" />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Game Permission</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registeredUsers.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.isOnline ? "Online" : "Offline"}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.hasGamePermission}
                      onChange={() =>
                        handlePermissionToggle(user.id, !user.hasGamePermission)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Maps Management" />
        <CardContent>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenAddDialog(true)}
          >
            Add Map
          </Button>

          <Grid container spacing={2} style={{ marginTop: "16px" }}>
            {maps.map((map) => (
              <Grid item xs={12} sm={6} md={4} key={map.id}>
                <Card
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                  }}
                >
                  <CardHeader
                    title={map.name}
                    titleTypographyProps={{ variant: "h6", noWrap: true }}
                    style={{ backgroundColor: "#f5f5f5" }}
                  />
                  <CardContent>
                    <Image
                      src={map.imageUrl}
                      alt={map.name}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "4px",
                      }}
                    />
                    <Box mt={2}>
                      <Typography variant="body1" gutterBottom>
                        Start Date: <strong>{map.gameStartDate}</strong>
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Start Time: <strong>{map.gameStartTime}</strong>
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Players Number: <strong>{map.playersNumber}</strong>
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Telegram Link:{" "}
                        <a
                          href={map.telegramLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {map.telegramLink}
                        </a>
                      </Typography>
                    </Box>
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginRight: "8px" }}
                        onClick={() => handleEditMap(map)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteMap(map.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Add Map Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Map</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddMap}>
            <FormControl fullWidth margin="normal" variant="outlined">
              <TextField
                label="Map Name"
                value={newMapName}
                onChange={(e) => setNewMapName(e.target.value)}
                required
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Game Start Date"
                type="date"
                value={gameStartDate}
                onChange={(e) => setGameStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                required
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Game Start Time"
                type="time"
                value={gameStartTime}
                onChange={(e) => setGameStartTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                required
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Players Number"
                value={playersNumber}
                onChange={(e) => setPlayersNumber(e.target.value)}
                required
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Telegram Link"
                value={telegramLink}
                onChange={(e) => setTelegramLink(e.target.value)}
                required
                margin="normal"
                variant="outlined"
              />
              <div style={{ marginTop: "16px" }}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                  style={{ display: "block", width: "100%" }}
                />
              </div>
            </FormControl>
            <DialogActions>
              <Button type="submit" color="primary" variant="contained">
                Add Map
              </Button>
              <Button
                onClick={() => setOpenAddDialog(false)}
                color="secondary"
                variant="outlined"
              >
                Cancel
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Map Dialog */}
      {/* Edit Map Dialog */}
      {editMap && (
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit Map</DialogTitle>
          <DialogContent>
            <form onSubmit={handleUpdateMap}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <TextField
                  label="Map Name"
                  value={newMapName}
                  onChange={(e) => setNewMapName(e.target.value)}
                  required
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="Game Start Date"
                  type="date"
                  value={gameStartDate}
                  onChange={(e) => setGameStartDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="Game Start Time"
                  type="time"
                  value={gameStartTime}
                  onChange={(e) => setGameStartTime(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="Players Number"
                  value={playersNumber}
                  onChange={(e) => setPlayersNumber(e.target.value)}
                  required
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="Telegram Link"
                  value={telegramLink}
                  onChange={(e) => setTelegramLink(e.target.value)}
                  required
                  margin="normal"
                  variant="outlined"
                />
                <div style={{ marginTop: "16px" }}>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: "block", width: "100%" }}
                  />
                </div>
              </FormControl>
              <DialogActions>
                <Button type="submit" color="primary" variant="contained">
                  Update Map
                </Button>
                <Button
                  onClick={() => setOpenEditDialog(false)}
                  color="secondary"
                  variant="outlined"
                >
                  Cancel
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
