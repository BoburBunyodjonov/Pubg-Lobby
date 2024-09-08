import { GameMap, UsageStats } from '@/types/types';
import { realTimeDB, auth } from './firebase';

  import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    User,
    onAuthStateChanged
  } from 'firebase/auth';

  import { ref, set, get, query, orderByChild, equalTo, update, onDisconnect, push, remove  } from 'firebase/database';

  export interface Participant {
    id: string;
    name: string;
    email: string;
    phone: number;
    isOnline: boolean;
    hasGamePermission: boolean;
  }



 export interface RegsiterLobby {
    createdAt: string;
    lobbyType: string;
    map: string;
    date: string;
    registrationUrl: string;
    players: {
      fullName: string;
      email: string;
      phoneNumber: string;
      pubgId: string;
    }[];
  }


  export const getRegisteredLobby = async (): Promise<RegsiterLobby[]> => {
    try {
      const lobbyRef = ref(realTimeDB, 'lobbyRegister');
      const snapshot = await get(lobbyRef);
  
      if (snapshot.exists()) {
        const lobbyData = snapshot.val();
  
        return Object.keys(lobbyData).map(id => ({
          createdAt: lobbyData[id].createdAt,
          lobbyType: lobbyData[id].lobbyType,
          map: lobbyData[id].map,
          date: lobbyData[id].date,
          registrationUrl: lobbyData[id].registrationUrl,
          players: lobbyData[id].players.map((player: any) => ({
            fullName: player.fullName,
            phoneNumber: player.phoneNumber,
            pubgId: player.pubgId,
            email: player.email,
          }))
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching registered users: ", error);
      throw error;
    }
  };
  
  

  export const getRegisteredUsers = async (): Promise<Participant[]> => {
    try {
      const usersRef = ref(realTimeDB, 'users');
      const snapshot = await get(usersRef);
  
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        return Object.keys(usersData).map(id => ({
          id,
          ...usersData[id] as Omit<Participant, 'id'> 
         
        }));
      } else {
        return []; 
      }
    } catch (error) {
      console.error("Error fetching registered users: ", error);
      throw error;
    }
  };

  export const registerUser = async (email: string, password: string, name: string, phone: string): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userRef = ref(realTimeDB, `users/${userCredential.user.uid}`);
      await set(userRef, {
        uid: userCredential.user.uid,
        name,
        email,
        phone,
        password, 
      });
      
      return userCredential.user;
    } catch (error) {
      console.error("Error registering user: ", error);
      throw error;
    }
  };
  

  export const loginAdmin = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (email === "admin12345@gmail.com" && password === "admin12345") {
        window.location.href = "/dashboard";
      } else {
        throw new Error("Unauthorized");
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      throw error;
    }
  };

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in: ", error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out: ", error);
    throw error;
  }
};

export const getParticipants = async (): Promise<Participant[]> => {
    try {
      const participantsRef = ref(realTimeDB, 'users');
      const snapshot = await get(participantsRef);
  
      if (snapshot.exists()) {
        const participantsData = snapshot.val();
  
        return Object.keys(participantsData).map(id => ({
          id, 
          ...participantsData[id], 
          originalId: participantsData[id].id, 
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching participants: ", error);
      throw error;
    }
  };
  
  export const getCurrentUser = (): User | null => {
    return auth.currentUser;
  };

  export const getOnlineUsers = async (): Promise<Participant[]> => {
    try {
      const usersRef = ref(realTimeDB, 'users');
      const onlineUsersQuery = query(usersRef, orderByChild('isOnline'), equalTo(true));
  
      const snapshot = await get(onlineUsersQuery);
  
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        return Object.keys(usersData).map(id => ({
          id,
          ...usersData[id] as Omit<Participant, 'id'>
        }));
      } else {
        return []; 
      }
    } catch (error) {
      console.error("Error fetching online users: ", error);
      throw error;
    }
  };


  export const updateGamePermission = async (userId: string, hasPermission: boolean): Promise<void> => {
    try {
      const userRef = ref(realTimeDB, `users/${userId}`);
  
      await update(userRef, { hasGamePermission: hasPermission });
    } catch (error) {
      console.error("Error updating game permission: ", error);
      throw error;
    }
  };



  // export const getSiteUsageStats = async (): Promise<UsageStats[]> => {
  //   try {
  //     const statsRef = ref(realTimeDB, 'siteStats');
  //     const snapshot = await get(statsRef);
  
  //     if (snapshot.exists()) {
  //       const statsData = snapshot.val();
        
  //       // Ensure the data is properly formatted
  //       return Object.keys(statsData).map(date => ({
  //         date,
  //         visitors: typeof statsData[date].visitors === 'number' ? statsData[date].visitors : 0 // Default to 0 if not a number
  //       }));
  //     } else {
  //       return [];
  //     }
  //   } catch (error) {
  //     console.error("Error fetching site usage stats: ", error);
  //     throw error;
  //   }
  // };

  // export const setupOnlineStatusListener = (userId: string) => {
  //   const userRef = ref(realTimeDB, `users/${userId}`);
  
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       update(userRef, { isOnline: true });
  //       onDisconnect(userRef).update({ isOnline: false });
  //     } else {
  //       update(userRef, { isOnline: false });
  //     }
  //   });
  // };

 
  export const addMap = async (
    name: string,
    imageUrl: string,
    gameStartDate: string,
    telegramLink: string,
    gameStartTime: string,
    playersNumber: string
): Promise<GameMap> => {
    try {
        const mapsRef = ref(realTimeDB, 'maps');
        const newMapRef = push(mapsRef);
        await set(newMapRef, { name, imageUrl, gameStartDate, telegramLink, gameStartTime, playersNumber });
        
        return {
            id: newMapRef.key as string, // Use key as the ID
            name,
            imageUrl,
            gameStartDate,
            telegramLink,
            gameStartTime,
            playersNumber,
        };
    } catch (error) {
        console.error("Error adding new map: ", error);
        throw error;
    }
};






  export const getMaps = async (): Promise<GameMap[]> => {
    try {
      const mapsRef = ref(realTimeDB, 'maps');
      const snapshot = await get(mapsRef);
  
      if (snapshot.exists()) {
        const mapsData = snapshot.val();
        return Object.keys(mapsData).map(id => ({
          id,
          name: mapsData[id].name || '', // Provide default values if necessary
          imageUrl: mapsData[id].imageUrl || '',
          gameStartDate: mapsData[id].gameStartDate || '',
          telegramLink: mapsData[id].telegramLink || '',
          gameStartTime: mapsData[id].gameStartTime || '',
          playersNumber: mapsData[id].playersNumber || '',
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching maps: ", error);
      throw error;
    }
  };


  export const updateMap = async (
    id: string,
    updatedFields: Partial<GameMap>
  ): Promise<void> => {
    try {
      const mapRef = ref(realTimeDB, `maps/${id}`);
      await update(mapRef, updatedFields);
    } catch (error) {
      console.error("Error updating map: ", error);
      throw error;
    }
  };

  export const deleteMap = async (id: string): Promise<void> => {
    try {
      const mapRef = ref(realTimeDB, `maps/${id}`);
      await remove(mapRef);
    } catch (error) {
      console.error("Error deleting map: ", error);
      throw error;
    }
  };
  