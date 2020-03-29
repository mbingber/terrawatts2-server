export const cashMoney = [
  10,
  22,
  33,
  44,
  54,
  64,
  73,
  82,
  90,
  98,
  105,
  112,
  118,
  124,
  129,
  134,
  138,
  142,
  145,
  148,
  150,
  152
];

export const makeMoney = (numPowered: number): number => {
  if (numPowered > 20) {
    return numPowered[20];
  }
  
  return cashMoney[numPowered];
}
