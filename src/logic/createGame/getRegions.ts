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
  }
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
  numRegions: number
): number[][] => {
  return perms([1, 2, 3, 4, 5, 6])
    .map(list => list.slice(0, numRegions))
    .map(list => list.sort())
    .map(list => list.join('_'))
    .sort()
    .filter((el, idx, arr) => el !== arr[idx + 1])
    .map(str => str.split('_'))
    .map(arr => arr.map(Number))
    .filter(list => list
      .every((region) => list
        .some(other =>
          edges[`${region}_${other}`] ||
          edges[`${other}_${region}`]
        )
      )
    )
}

export const getRegions = (mapName: string, numPlayers: number): number[] => {
  const edges = edgesByMap[mapName];
  const numRegions = numRegionsByNumPlayers[numPlayers];

  const potentials = getPotentialRegionLists(edges, numRegions);

  return potentials[Math.floor(Math.random() * potentials.length)];
};
