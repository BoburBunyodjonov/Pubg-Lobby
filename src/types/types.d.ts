export interface GameMap {
    id: string;
    name: string;
    imageUrl: string;
    gameStartDate: string;
    telegramLink: string;
    gameStartTime: string;
    playersNumber: string;
    allowIsRegister: boolean;
  }
  interface UsageStats {
    date: string;
    visitors: number;
  }