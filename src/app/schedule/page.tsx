"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  getParticipants,
  logoutUser,
  Participant,
} from "../../data/firebaseUtils";
import Layout from "@/components/Layout";

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const fetchedParticipants = await getParticipants();
        setParticipants(fetchedParticipants);
      } catch (error) {
        console.error("Error fetching participants: ", error);
      }
    };

    fetchParticipants();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <Layout>
      <div
        style={{
          backgroundColor: "#121212",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <br /><br />
        <Container
          sx={{ backgroundColor: "#1e1e1e", color: "white", boxShadow: 3 }}
        >
          <CardHeader
            title={
              <Typography
                variant="h6"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Tournament Participants
              </Typography>
            }
            action={
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            }
            sx={{ borderBottom: "1px solid #333", padding: "16px" }}
          />
          <CardContent>
            <TableContainer
              component={Paper}
              sx={{ backgroundColor: "#2e2e2e" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Player
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      PUBG ID
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {participants.length > 0 ? (
                    participants.map((participant, index) => (
                      <TableRow
                        key={index}
                        hover
                        sx={{ "&:hover": { backgroundColor: "#424242" } }}
                      >
                        <TableCell>
                          <Avatar
                            sx={{ backgroundColor: "#616161", color: "#fff" }}
                            src={`https://api.dicebear.com/6.x/initials/svg?seed=${participant.name}`}
                          >
                            {participant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </Avatar>
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {participant.name}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {participant.phone}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        sx={{ color: "gray", textAlign: "center" }}
                      >
                        No participants found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Container>
      </div>
    </Layout>
  );
}
