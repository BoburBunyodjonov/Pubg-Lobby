import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, TimerIcon, Users } from "lucide-react";
import Link from "next/link";
import RegisterLobbyModal from "./RegisterLobbyModal";
import { useEffect, useState } from "react";

enum LobbyType {
  Solo = "Solo",
  Duo = "Duo",
  Squad = "Squad",
}

interface TournamentCardProps {
  title: string;
  date: string;
  imageUrl: string;
  registrationUrl: string;
  time: string;
  playersNumber: string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  title,
  date,
  imageUrl,
  registrationUrl,
  time,
  playersNumber,
}) => {

  type LobbyType = "Solo" | "Duo" | "Squad";

function convertToLobbyType(value: string): LobbyType {
  if (value === "Solo" || value === "Duo" || value === "Squad") {
    return value;
  }
  throw new Error("Invalid lobby type");
}

// Assuming playersNumber is a string that can be "Solo", "Duo", or "Squad"

// Convert the string to the appropriate type
const lobbyType = convertToLobbyType(playersNumber);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('userRegister')) {
        window.location.href = '/register';
      } else {
        setIsModalOpen(true);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  return (
    <Card className="overflow-hidden rounded-lg shadow-lg bg-gray-900 border border-gray-700">
      <CardHeader className="relative h-40">
        <Image
          src={imageUrl}
          alt={`${title} tournament image`}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-yellow-500 text-2xl font-bold mb-2">
          {title}
        </CardTitle>
        <div className="space-y-2 text-gray-400">
          <CardDescription className="flex items-center">
            <CalendarIcon className="mr-2 h-6 w-6 text-yellow-500" />
            <span className="text-yellow-500 font-bold ">Boshlanish sansi: </span>
            <span className="ml-2 text-white">{date}</span>
          </CardDescription>
          <CardDescription className="flex items-center">
            <TimerIcon className="mr-2 h-6 w-6 text-yellow-500" />
            <span className="text-yellow-500 font-bold ">Boshlanish vaqti: </span>
            <span className="ml-2 text-white">{time}</span>
          </CardDescription>
          <CardDescription className="flex items-center">
            <Users className="mr-2 h-6 w-6 text-yellow-500" />
            <span className="text-white">{playersNumber}</span>
          </CardDescription>
        </div>
      </CardContent>
      <CardFooter className="p-4">
      <Button
        onClick={handleOpenModal}
        className="w-full bg-yellow-600 text-white p-3 rounded-lg hover:bg-yellow-700 transition-colors duration-300 ease-in-out"
      >
        Register Lobby
      </Button>
      </CardFooter>
      <RegisterLobbyModal registrationUrl={registrationUrl}  map={title} date={date} open={isModalOpen} onClose={handleCloseModal} lobbyType={LobbyType[playersNumber as keyof typeof LobbyType]} />
    </Card>
  );
};

export default TournamentCard;
