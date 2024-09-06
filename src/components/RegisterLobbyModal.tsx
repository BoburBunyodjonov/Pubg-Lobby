import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Grid, IconButton } from "@mui/material";
import { ref, push } from "firebase/database";
import { realTimeDB } from "../data/firebase"; // Adjust the path
import { toast } from "react-toastify";
import { CircleX } from "lucide-react";

export interface RegisterLobbyModalProps {
  open: boolean;
  onClose: () => void;
  lobbyType: "Solo" | "Duo" | "Squad";
}

const RegisterLobbyModal: React.FC<RegisterLobbyModalProps> = ({
  open,
  onClose,
  lobbyType,
}) => {
  // Initialize players based on the lobby type
  const initialPlayers = Array(lobbyType === "Solo" ? 1 : lobbyType === "Duo" ? 2 : 4).fill({
    fullName: "",
    pubgId: "",
    phoneNumber: "",
  });

  const [players, setPlayers] = useState(initialPlayers);

  // Handle change in input fields
  const handleChange = (index: number, field: string, value: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player, i) =>
        i === index ? { ...player, [field]: value } : player
      )
    );
  };

  // Handle registration and reset form
  const handleRegister = async () => {
    
    try {
      const lobbyRef = ref(realTimeDB, `lobbyRegister`);
      const lobbyData = {
        lobbyType,
        players,
        createdAt: new Date().toISOString(),
      };

      // Push data to Firebase
      await push(lobbyRef, lobbyData);

      // Show success toast
      toast.success("Players registered successfully!");

      // Reset form
      setPlayers(initialPlayers);

      // Close modal
      onClose();
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Failed to register players. Please try again.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
      onClick={onClose}
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 1, // Ensure the button is above the content
      }}
    >
      <CircleX className="text-red-500" />
    </IconButton>
        <Typography variant="h6" component="h2" textAlign="center">
          {lobbyType} Registration
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {players.map((player, index) => (
            <Grid item xs={12} sm={lobbyType === "Solo" ? 12 : 6} key={index}>
              <Typography variant="subtitle1" textAlign="center">
                Player {index + 1}
              </Typography>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                margin="normal"
                value={player.fullName}
                onChange={(e) =>
                  handleChange(index, "fullName", e.target.value)
                }
              />
              <TextField
                fullWidth
                label="PUBG ID"
                variant="outlined"
                margin="normal"
                value={player.pubgId}
                onChange={(e) => handleChange(index, "pubgId", e.target.value)}
              />
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                margin="normal"
                value={player.phoneNumber}
                onChange={(e) =>
                  handleChange(index, "phoneNumber", e.target.value)
                }
              />
            </Grid>
          ))}
        </Grid>
        <Button
          onClick={handleRegister} 
          className="w-full bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700 transition-colors duration-300 ease-in-out"
        >
          Register Lobby
        </Button>
      </Box>
    </Modal>
  );
};

export default RegisterLobbyModal;
