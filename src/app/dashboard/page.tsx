"use client";

import _ from "lodash";
import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { auth, realTimeDB } from "../../data/firebase"; // Ensure correct import
import {
  ref,
  push,
  set,
  query,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
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
  Tabs,
  Tab,
  Select,
  MenuItem,
  Tooltip,
  FormControlLabel,
  Switch,
} from "@mui/material";
// @ts-ignore
import Grid from "@mui/material/Grid";
import Grid2 from "@mui/material/Grid2";
import {
  getRegisteredUsers,
  updateGamePermission,
  logoutUser,
  addMap,
  getMaps,
  deleteMap,
  updateMap,
  getRegisteredLobby,
  RegsiterLobby,
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
  allowIsRegister: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className="w-[100%]"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function DashboardPage() {
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [registeredLobby, setRegisteredLobby] = useState<RegsiterLobby[]>([]);
  const [maps, setMaps] = useState<Map[]>([]);
  const [newMapName, setNewMapName] = useState("");
  const [gameStartDate, setGameStartDate] = useState("");
  const [gameStartTime, setGameStartTime] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [allowIsRegister, setAllowIsRegister] = useState<boolean>(false);
  const [playersNumber, setPlayersNumber] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editMap, setEditMap] = useState<Map | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [mapFilter, setMapFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [lobbyTypeFilter, setLobbyTypeFilter] = useState("");
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("Admin")) {
        window.location.href = "/";
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getRegisteredUsers();
        setRegisteredUsers(users);

        const fetchedMaps = await getMaps();
        setMaps(fetchedMaps);
      } catch (error) {
        toast.error("Error fetching dashboard data: ");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersLobby = await getRegisteredLobby();
        setRegisteredLobby(usersLobby);

        const fetchedMaps = await getMaps();
        setMaps(fetchedMaps);
      } catch (error) {
        toast.error("Error fetching dashboard data: ");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

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
            formattedPlayersNumber,
            allowIsRegister
          );

          const newMap: Map = {
            id: uuidv4(), // Generate a unique ID
            name: newMapName,
            imageUrl,
            gameStartDate,
            telegramLink,
            gameStartTime,
            allowIsRegister,
            playersNumber: formattedPlayersNumber, // Use formatted value
          };

          // Update the maps state and clear form fields
          setMaps((prevMaps) => [...prevMaps, newMap]);
          setNewMapName("");
          setGameStartDate("");
          setTelegramLink("");
          setGameStartTime("");
          setPlayersNumber("");
          setAllowIsRegister(Boolean);
          setSelectedFile(null); // Reset the selected file

          // Show success notification
          toast.success("Map added successfully!");
        } else {
          toast.error("Failed to get image URL");
        }
      } catch (error) {
        toast.error("Failed to add map.");
      }
    } else {
      toast.error("Please select a file.");
    }
  };

  const handleEditMap = (map: Map) => {
    setEditMap(map);
    setNewMapName(map.name);
    setGameStartDate(map.gameStartDate);
    setGameStartTime(map.gameStartTime);
    setTelegramLink(map.telegramLink);
    setPlayersNumber(formattedPlayersNumber);
    setAllowIsRegister(map.allowIsRegister);
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
            toast.error("Failed to get image URL");
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
          allowIsRegister: allowIsRegister,
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
                  allowIsRegister: allowIsRegister || map.allowIsRegister,
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
        setAllowIsRegister(false);
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
  const colors = [
    "#e0f7fa", // Light cyan
    "#ffccbc", // Light orange
    "#dcedc8", // Light green
    "#f8bbd0", // Light pink
    "#c5cae9", // Light blue
    "#fdd835", // Yellow
    "#ab47bc", // Purple
    "#ff7043", // Deep orange
    "#64b5f6", // Light blue
    "#4caf50", // Green
    "#f44336", // Red
    "#9c27b0", // Purple
    "#03a9f4", // Light blue
    "#c2185b", // Pink
    "#8bc34a", // Green
    "#ffeb3b", // Yellow
    "#ff5722", // Deep orange
    "#9e9e9e", // Grey
    "#673ab7", // Deep purple
    "#009688", // Teal
  ];

  const getUserIdByEmail = async (email: string) => {
    const usersRef = ref(realTimeDB, "users"); // Foydalanuvchi ma'lumotlari saqlanadigan yo'l
    const q = query(usersRef, orderByChild("email"), equalTo(email));
    const snapshot = await get(q);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const userId = Object.keys(userData)[0]; // Birinchi foydalanuvchi ID sini olish
      return userId;
    } else {
      console.error("User not found");
      return null;
    }
  };

  // Xabar yuborish funksiyasi
  const sendMessageToUser = async (userId: string, registrationUrl: string) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const message = `Siz Lobby uchun ro'yxatdan o'tgansiz va shu lobby da qatnashish uchun havolani bosing va o'yinni boshlang. ${registrationUrl}`;
      const messagesRef = ref(realTimeDB, `messages/${userId}`);
      const newMessageRef = push(messagesRef); // Yangi unique reference yaratish

      const messageData = {
        content: message,
        timestamp: Date.now(),
      };

      // Xabar malumotlarini loglash
      await set(newMessageRef, messageData);

      toast.success("Message sent message successfully");
    } catch (error) {
      // Xatolikni loglash
      toast.error("Error sending message:");
    }
  };

  // Xabarni tugma bosilganda yuborish
  const handleSendMessage = async (email: string, registrationUrl: string) => {
    console.log(
      "Handling send message with email:",
      email,
      "and registration URL:",
      registrationUrl
    );
    try {
      const userId = await getUserIdByEmail(email);

      if (userId) {
        await sendMessageToUser(userId, registrationUrl);
      } else {
        toast.error("No user ID available to send a message.");
      }
    } catch (error) {
      toast.error("Error handling send message:");
    }
  };

  const [tooltipText, setTooltipText] = useState("Click to copy");

  const handleCopy = (text: any) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setTooltipText("Copied!"); // Change tooltip text after copying
          setTimeout(() => setTooltipText("Click to copy"), 2000); // Reset text after 2 seconds
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setTooltipText("Copied!");
        setTimeout(() => setTooltipText("Click to copy"), 2000);
      } catch (err) {
        console.error("Failed to copy text using fallback: ", err);
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <>
      <div className="container mx-auto p-5">
        <ToastContainer />
        <Grid2
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
        </Grid2>

        <Box
          width={"100%"}
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
            display: "",
          }}
        >
          <Tabs
            // orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ border: "1px solid silver"}}
          >
            <Tab sx={{color: 'black', fontWeight: "700"}} label="Dashboard" {...a11yProps(0)} />
            <Tab sx={{color: 'black', fontWeight: "700"}} label="All Users" {...a11yProps(1)} />
            <Tab sx={{color: 'black', fontWeight: "700"}} label="Add Maps" {...a11yProps(2)} />
            <Tab sx={{color: 'black', fontWeight: "700"}} label="Registered to Lobby" {...a11yProps(3)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <div
              className="grid grid-cols-2 gap-4"
              style={{ marginBottom: "32px" }}
            >
              <Card>
                <CardHeader title="Registered Users" />
                <CardContent>
                  <Typography variant="h3" component="div" fontWeight="bold">
                    {registeredUsers.length}
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardHeader title="Online Users" />
                <CardContent>
                  <Typography variant="h3" component="div" fontWeight="bold">
                    {registeredUsers.filter((user) => user.isOnline).length}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Card style={{ marginBottom: "32px", overflow: 'scroll'}}>
              <CardHeader title="User Management" />
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {registeredUsers.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          {user.isOnline ? "Online" : "Offline"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value={value} index={2}>
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
                <div
                  className="grid xl:grid-cols-4 md:grid-cols-2 gap-4"
                  style={{ marginTop: "16px" }}
                >
                  {maps.map((map) => (
                    <div className="" key={map.id}>
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
                            width={100}
                            height={100}
                            style={{
                              width: "100%",
                              height: "100%",
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
                              Players Number:{" "}
                              <strong>{map.playersNumber}</strong>
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
                    <label id="players-number-label">Players Number</label>
                    <Select
                      labelId="players-number-label"
                      value={playersNumber}
                      onChange={(e) => setPlayersNumber(e.target.value)}
                      label="Players Number"
                    >
                      <MenuItem value="Solo">Solo</MenuItem>
                      <MenuItem value="Duo">Duo</MenuItem>
                      <MenuItem value="Squad">Squad</MenuItem>
                    </Select>

                    <TextField
                      label="Telegram Link"
                      value={telegramLink}
                      onChange={(e) => setTelegramLink(e.target.value)}
                      required
                      margin="normal"
                      variant="outlined"
                    />
                    <FormControlLabel
                        control={
                          <Switch
                            checked={allowIsRegister}
                            onChange={(e) => setAllowIsRegister(e.target.checked)}
                            color="primary"
                          />
                        }
                        label={
                          allowIsRegister
                            ? "Registrationni O'chirish"
                            : "Registrationni Yoqish"
                        }
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
                      <label id="players-number-label">Players Number</label>
                      <Select
                        labelId="players-number-label"
                        value={playersNumber}
                        onChange={(e) => setPlayersNumber(e.target.value)}
                        label="Players Number"
                      >
                        <MenuItem value="Solo">Solo</MenuItem>
                        <MenuItem value="Duo">Duo</MenuItem>
                        <MenuItem value="Squad">Squad</MenuItem>
                      </Select>
                      <TextField
                        label="Telegram Link"
                        value={telegramLink}
                        onChange={(e) => setTelegramLink(e.target.value)}
                        required
                        margin="normal"
                        variant="outlined"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={allowIsRegister}
                            onChange={(e) => setAllowIsRegister(e.target.checked)}
                            color="primary"
                          />
                        }
                        label={
                          allowIsRegister
                            ? "Registeratsiyani o'chirish"
                            : "Registeratsiyani yoqish"
                        }
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
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Card sx={{ mb: 4, boxShadow: 3, overflow: 'scroll' }}>
              <CardHeader
                title="Registered to Lobby"
                titleTypographyProps={{
                  variant: "h5",
                  fontWeight: "bold",
                  color: "primary.main",
                }}
                sx={{backgroundColor: "#f5f5f5", padding: 2 }}
              />
              <CardContent>
                <div
                  style={{ marginBottom: "16px", display: "flex", gap: "16px" }}
                >
                  <Select
                    labelId="map-filter-label"
                    value={mapFilter}
                    onChange={(e) => setMapFilter(e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Filter by map" }}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="">All Maps</MenuItem>
                    {/* Replace with dynamic map options */}
                    {Array.from(
                      new Set(registeredLobby.map((lobby) => lobby.map))
                    ).map((map) => (
                      <MenuItem key={uuidv4()} value={map}>
                        {map}
                      </MenuItem>
                    ))}
                  </Select>
                  <Select
                    labelId="lobby-type-filter-label"
                    value={lobbyTypeFilter}
                    onChange={(e) => setLobbyTypeFilter(e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Filter by lobby type" }}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="">All Lobby Types</MenuItem>
                    {/* Replace with dynamic lobby type options */}
                    {Array.from(
                      new Set(registeredLobby.map((lobby) => lobby.lobbyType))
                    ).map((type) => (
                      <MenuItem key={uuidv4()} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  <Select
                    labelId="date-filter-label"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Filter by date" }}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="">All Dates</MenuItem>
                    {/* Replace with dynamic date options */}
                    {Array.from(
                      new Set(registeredLobby.map((lobby) => lobby.date))
                    ).map((date) => (
                      <MenuItem key={uuidv4()} value={date}>
                        {date}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                {_.map(
                  _.groupBy(
                    registeredLobby.filter(
                      (lobbyWrapper) =>
                        (mapFilter ? lobbyWrapper.map === mapFilter : true) &&
                        (dateFilter
                          ? lobbyWrapper.date === dateFilter
                          : true) &&
                        (lobbyTypeFilter
                          ? lobbyWrapper.lobbyType === lobbyTypeFilter
                          : true)
                    ),
                    (lobbyWrapper: any) =>
                      `${lobbyWrapper.map}-${lobbyWrapper.lobbyType}-${lobbyWrapper.date}`
                  ),

                  (groupedLobbies: any, key: any) => (
                    <div
                      key={uuidv4()}
                      style={{
                        marginBottom: "24px",
                        padding: "16px",
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: "secondary.main", fontWeight: "bold" }}
                      >
                        {groupedLobbies[0].lobbyType} - {groupedLobbies[0].map}{" "}
                        - {groupedLobbies[0].date}
                      </Typography>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "text.primary" }}
                            >
                              #
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "text.primary" }}
                            >
                              Full Name
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "text.primary" }}
                            >
                              Team Name
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "text.primary" }}
                            >
                              Phone Number
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "text.primary" }}
                            >
                              Email
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "text.primary" }}
                            >
                              PUBG ID
                            </TableCell>
                            <TableCell
                              sx={{ fontWeight: "bold", color: "text.primary" }}
                            >
                              Message
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {groupedLobbies.flatMap(
                            (lobbyWrapper: any, lobbyIndex: any) =>
                              lobbyWrapper.players.map(
                                (player: any, playerIndex: any) => (
                                  <TableRow
                                    key={uuidv4()}
                                    sx={{
                                      backgroundColor:
                                        playerIndex % 2 === 0
                                          ? "#f9f9f9"
                                          : "#ffffff",
                                    }}
                                  >
                                    <TableCell
                                      sx={{
                                        fontWeight: "bold",
                                        backgroundColor:
                                          colors[lobbyIndex % colors.length],
                                        color: "text.primary",
                                      }}
                                    >
                                      {lobbyIndex + 1}.{playerIndex + 1}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        fontWeight: "bold",
                                        backgroundColor:
                                          colors[lobbyIndex % colors.length],
                                        color: "text.primary",
                                      }}
                                    >
                                      <Tooltip title={tooltipText} arrow>
                                        <span
                                          className="p-2 cursor-pointer select-none"
                                          onClick={() =>
                                            handleCopy(player.fullName)
                                          }
                                        >
                                          {player.fullName}
                                        </span>
                                      </Tooltip>
                                    </TableCell>

                                    <TableCell
                                      sx={{
                                        fontWeight: "bold",
                                        backgroundColor:
                                          colors[lobbyIndex % colors.length],
                                        color: "text.primary",
                                      }}
                                    >
                                      <Tooltip title={tooltipText} arrow>
                                        <span
                                          className=" p-2 cursor-pointer select-none"
                                          onClick={() =>
                                            handleCopy(lobbyWrapper.groupName)
                                          }
                                        >
                                          {lobbyWrapper.groupName}
                                        </span>
                                      </Tooltip>
                                    </TableCell>

                                    <TableCell
                                      sx={{
                                        fontWeight: "bold",
                                        backgroundColor:
                                          colors[lobbyIndex % colors.length],
                                        color: "text.primary",
                                      }}
                                    >
                                      <Tooltip title={tooltipText} arrow>
                                        <span
                                          className=" p-2 cursor-pointer select-none"
                                          onClick={() =>
                                            handleCopy(player.phoneNumber)
                                          }
                                        >
                                          {player.phoneNumber}
                                        </span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        fontWeight: "bold",
                                        backgroundColor:
                                          colors[lobbyIndex % colors.length],
                                        color: "text.primary",
                                      }}
                                    >
                                      <Tooltip title={tooltipText} arrow>
                                        <span
                                          className=" p-2 cursor-pointer select-none"
                                          onClick={() =>
                                            handleCopy(lobbyWrapper.email)
                                          }
                                        >
                                          {lobbyWrapper.email}
                                        </span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        fontWeight: "bold",
                                        backgroundColor:
                                          colors[lobbyIndex % colors.length],
                                        color: "text.primary",
                                      }}
                                    >
                                      <Tooltip title={tooltipText} arrow>
                                        <span
                                          className=" p-2 cursor-pointer select-none"
                                          onClick={() =>
                                            handleCopy(player.pubgId)
                                          }
                                        >
                                          {player.pubgId}
                                        </span>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        fontWeight: "bold",
                                        backgroundColor:
                                          colors[lobbyIndex % colors.length],
                                        color: "text.primary",
                                      }}
                                    >
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                          handleSendMessage(
                                            lobbyWrapper.email,
                                            groupedLobbies[0].registrationUrl
                                          )
                                        }
                                      >
                                        Send Message
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                )
                              )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </TabPanel>
        </Box>
      </div>
    </>
  );
}
