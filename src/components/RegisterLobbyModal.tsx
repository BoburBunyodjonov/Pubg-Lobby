import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import { ref, push, onValue, get } from "firebase/database";
import { auth, realTimeDB } from "../data/firebase"; // Adjust the path
import { toast } from "react-toastify";
import { CircleX } from "lucide-react";
import { User } from "firebase/auth";

export interface RegisterLobbyModalProps {
  open: boolean;
  onClose: () => void;
  lobbyType: "Solo" | "Duo" | "Squad";
  map: string;
  date: string;
  registrationUrl: string;
}

interface UserData {
  email: string;
}

const RegisterLobbyModal: React.FC<RegisterLobbyModalProps> = ({
  open,
  onClose,
  lobbyType,
  map,
  date,
  registrationUrl,
}) => {
  // Initialize players based on the lobby type
  const initialPlayers = Array(
    lobbyType === "Solo" ? 1 : lobbyType === "Duo" ? 2 : 4
  ).fill({
    fullName: "",
    pubgId: "",
    phoneNumber: "",
  });

  const [players, setPlayers] = useState(initialPlayers);
  const [user, setUser] = useState<User | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState(Boolean);
  // const [email, setEmail] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);

  // Handle change in input fields

  const handleRegister = async () => {
    let hasError = false; // Track validation errors

    // Check if the group name is empty
    if (!groupName) {
      setGroupNameError(true);
      hasError = true;
    } else {
      setGroupNameError(false);
    }

    // Check if any player fields are empty
    const updatedPlayers = players.map((player) => {
      const newPlayer = { ...player, errors: {} };

      if (!player.fullName) {
        newPlayer.errors.fullName = "Toʻliq ism talab qilinadi";
        hasError = true;
      }

      if (!player.pubgId) {
        newPlayer.errors.pubgId = "PUBG ID talab qilinadi";
        hasError = true;
      }

      if (!player.phoneNumber) {
        newPlayer.errors.phoneNumber = "Telefon raqami kerak";
        hasError = true;
      }

      return newPlayer;
    });

    // Update the players state with validation errors
    setPlayers(updatedPlayers);

    // If there's an error, stop the registration process
    if (hasError) {
      toast.error("Barcha kerakli maydonlarni toʻldiring.");
      return;
    }

    // Proceed with registration if no errors
    try {
      const lobbyRef = ref(realTimeDB, `lobbyRegister`);
      const snapshot = await get(lobbyRef);
      let groupExists = false;

      if (snapshot.exists()) {
        const lobbyData = snapshot.val();
        groupExists = Object.values(lobbyData).some(
          (lobby: any) => lobby.groupName === groupName
        );
      }

      if (groupExists) {
        toast.error(
          "Bu guruh nomi allaqachon olingan. Boshqa nom tanlang."
        );
        return;
      }

      const lobbyData = {
        map: map,
        date: date,
        registrationUrl: registrationUrl,
        groupName: groupName,
        email: userData?.email,
        lobbyType: lobbyType,
        players: players,
        createdAt: new Date().toISOString(),
      };

      // Push data to Firebase
      await push(lobbyRef, lobbyData);

      // Show success toast
      toast.success("O'yinchilar ro'yxatdan o'tishdi!");

      // Reset form
      setPlayers(initialPlayers);
      setGroupName("");
      onClose();
    } catch (error) {
      console.error("Hujjat qo‘shishda xatolik yuz berdi: ", error);
      toast.error("O‘yinchilarni ro‘yxatdan o‘tkazib bo‘lmadi. Iltimos, qayta urinib koʻring.");
    }
  };

  // Handle input change and clear error for group name
  const handleGroupNameChange = (e: any) => {
    setGroupName(e.target.value);
    if (groupNameError) setGroupNameError(false); // Clear error on input
  };

  // Handle input change for player fields and clear specific field error
  const handlePlayerChange = (index: number, field: string, value: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index][field] = value;

    // Clear the error for the specific field if a value is entered
    if (updatedPlayers[index].errors) {
      updatedPlayers[index].errors[field] = !value
        ? `${field} majburiy, shart`
        : "";
    }

    setPlayers(updatedPlayers);
  };

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
    });
  };

  const fetchUserData = (userId: string) => {
    const userRef = ref(realTimeDB, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserData({
          email: data.email,
        });
      }
    });
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
        <Typography variant="h6" component="h2" textAlign="center">
          {lobbyType} Registration
        </Typography>

        <Box>
          <TextField
            fullWidth
            label="Group Name"
            variant="outlined"
            margin="normal"
            required
            error={groupNameError}
            helperText={groupNameError ? "Guruh nomi talab qilinadi" : ""}
            value={groupName}
            onChange={handleGroupNameChange}
          />
        </Box>

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
                required
                error={!!player.errors?.fullName}
                helperText={player.errors?.fullName}
                value={player.fullName}
                onChange={(e) =>
                  handlePlayerChange(index, "fullName", e.target.value)
                }
              />
              <TextField
                fullWidth
                label="PUBG ID"
                variant="outlined"
                margin="normal"
                required
                error={!!player.errors?.pubgId}
                helperText={player.errors?.pubgId}
                value={player.pubgId}
                onChange={(e) =>
                  handlePlayerChange(index, "pubgId", e.target.value)
                }
              />
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                margin="normal"
                required
                error={!!player.errors?.phoneNumber}
                helperText={player.errors?.phoneNumber}
                value={player.phoneNumber}
                onChange={(e) =>
                  handlePlayerChange(index, "phoneNumber", e.target.value)
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
