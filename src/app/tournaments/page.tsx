"use client";

import Layout from "@/components/Layout";
import TournamentCard from "@/components/TournamentCard";
import { getMaps } from "../../data/firebaseUtils";
import { useEffect, useState } from "react";
import { GameMap } from "@/types/types";
import Filters from "@/components/Filter";

const Tournaments = () => {
  const [maps, setMaps] = useState<GameMap[]>([]);
  const [filteredMaps, setFilteredMaps] = useState<GameMap[]>([]);
  const [playersFilter, setPlayersFilter] = useState<string | "all">("all");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedMaps = await getMaps();
        setMaps(fetchedMaps);
        setFilteredMaps(fetchedMaps); // Initialize filteredMaps
      } catch (error) {
        console.error("Error fetching maps data: ", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...maps];

      // Filter by players number
      if (playersFilter !== "all") {
        filtered = filtered.filter(
          (map) => map.playersNumber === playersFilter
        );
      }

      // Filter by date range
      if (startDate && endDate) {
        filtered = filtered.filter((map) => {
          const gameDate = new Date(map.gameStartDate);
          return (
            gameDate >= new Date(startDate) && gameDate <= new Date(endDate)
          );
        });
      }

      setFilteredMaps(filtered);
    };

    applyFilters();
  }, [playersFilter, startDate, endDate, maps]);

  return (
    <>
      <Layout>
        <div className="bg-gray-800 min-h-screen">
          {" "}
          <br />
          <br />
          <main className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center text-yellow-500">
              PUBG Mobile Tournaments
            </h1>
            <Filters
              playersFilter={playersFilter}
              setPlayersFilter={setPlayersFilter}
              startDate={startDate || ""} // Convert null to an empty string
              setStartDate={setStartDate}
              endDate={endDate || ""} // Convert null to an empty string
              setEndDate={setEndDate}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMaps
                .slice()
                .reverse()
                .map((map) => (
                  <TournamentCard
                    key={map.id}
                    title={map.name}
                    date={map.gameStartDate}
                    time={map.gameStartTime}
                    registrationUrl={map.telegramLink}
                    playersNumber={map.playersNumber}
                    imageUrl={map.imageUrl} // Ensure this is correct
                  />
                ))}
            </div>
          </main>
        </div>
      </Layout>
    </>
  );
};

export default Tournaments;
