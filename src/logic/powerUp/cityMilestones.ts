export const numCitiesToStartEra2 = (numPlayers: number): number => {
  return {
    2: 10,
    3: 7,
    4: 7,
    5: 7,
    6: 6
  }[numPlayers];
}

export const numCitiesToEndGame = (numPlayers: number): number => {
  return {
    2: 21,
    3: 17,
    4: 17,
    5: 15,
    6: 14
  }[numPlayers];
}
