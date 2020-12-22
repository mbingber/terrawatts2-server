export const numCitiesToStartEra2 = (numPlayers: number): number => {
  const map: Record<number, number> = {
    2: 10,
    3: 7,
    4: 7,
    5: 7,
    6: 6
  };
  
  return map[numPlayers];
}

export const numCitiesToEndGame = (numPlayers: number): number => {
  const map: Record<number, number> = {
    2: 21,
    3: 17,
    4: 17,
    5: 15,
    6: 14
  };
  
  return map[numPlayers];
}
