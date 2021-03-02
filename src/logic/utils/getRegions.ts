const edgesByMap: Record<string, Record<string, boolean>> = {
  USA: {
    '1_2': true,
    '1_4': true,
    '1_5': true,
    '2_3': true,
    '2_5': true,
    '2_6': true,
    '3_6': true,
    '4_5': true,
    '5_6': true
  },
  Germany: {
    '1_2': true,
    '1_3': true,
    '1_4': true,
    '2_4': true,
    '3_4': true,
    '3_5': true,
    '4_5': true,
    '4_6': true,
    '5_6': true
  },
  Italy: {
    '1_2': true,
    '1_3': true,
    '2_3': true,
    '3_4': true,
    '4_5': true,
    '5_6': true
  },
  Seattle: {
    '1_2': true,
    '1_3': true,
    '2_3': true,
    '2_4': true,
    '3_4': true,
    '3_5': true,
    '4_5': true,
    '4_6': true,
    '5_6': true
  },
  ['Northern Europe']: {
    '1_2': true,
    '1_3': true,
    '2_3': true,
    '2_4': true,
    '2_5': true,
    '3_4': true,
    '3_6': true,
    '4_5': true,
    '5_6': true
  },
  China: {
    '1_2': true,
    '1_4': true,
    '2_3': true,
    '2_4': true,
    '2_6': true,
    '4_5': true,
    '4_6': true,
    '5_6': true,
  },
  France: {
    '1_2': true,
    '1_3': true,
    '1_4': true,
    '1_5': true,
    '1_6': true,
    '2_3': true,
    '2_4': true,
    '4_5': true,
    '5_6': true,
    '3_6': true,
  },
};

const numRegionsByNumPlayers: Record<number, number> = {
  2: 3,
  3: 3,
  4: 4,
  5: 5,
  6: 5
};

const perms = <T>(arr: T[]): T[][] => arr.length === 1 ?
  [arr] :
  arr.reduce<T[][]>((acc, el, idx) => [
    ...acc,
    ...perms([...arr.slice(0, idx), ...arr.slice(idx + 1)])
      .map(p => [el, ...p])
  ], []);

const getPotentialRegionLists = (
  edges: Record<string, boolean>,
  numRegions: number,
  mapName: string,
): number[][] => {
  return perms([1, 2, 3, 4, 5, 6])
    .map(list => list.slice(0, numRegions))
    .map(list => list.sort())
    .map(list => list.join('_'))
    .sort()
    .filter((el, idx, arr) => el !== arr[idx + 1])
    .map(str => str.split('_'))
    .map(arr => arr.map(Number))
    .filter(list => mapName !== 'France' || list.includes(1))
    .filter(list => {
      const start = list[0];
      const visited = { [start]: true };
      const queue = [start];
      while (queue.length) {
        const current = queue.shift();
        const neighbors = Object.keys(edges).reduce<number[]>((acc, key) => {
          const [first, second] = key.split('_').map(Number);
          if (first === current && list.includes(second) && !visited[second]) {
            acc.push(second);
          } else if (second === current && list.includes(first) && !visited[first]) {
            acc.push(first);
          }
          return acc;
        }, []);
        neighbors.forEach(n => {
          visited[n] = true;
          queue.push(n);
        });
      }

      return Object.keys(visited).length === numRegions;
    });
}

export const getRegions = (mapName: string, numPlayers: number): number[] => {
  const edges = edgesByMap[mapName];
  const numRegions = numRegionsByNumPlayers[numPlayers];

  const potentials = getPotentialRegionLists(edges, numRegions, mapName);

  return potentials[Math.floor(Math.random() * potentials.length)];
};
