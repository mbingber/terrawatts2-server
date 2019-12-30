import { getCityCostHelper } from "./getCityCostHelper";
import { Game } from "../../entity/Game";

export const cityCost = async (game: Game, purchaseIds: number[]): Promise<number> => {
  const costHelper = await getCityCostHelper(game.map.name, game.regions);

  let remainingPurchaseIds = purchaseIds.slice();

  const network: number[] = game.cities
    .filter((cityInstance) =>
      cityInstance.players.some(p => p.id === game.activePlayer.id)
    ).map((cityInstance) => cityInstance.city.id);

  let connectionCost = 0;
  while (remainingPurchaseIds.length > 0) {
    if (network.length === 0) {
      network.push(remainingPurchaseIds[0]);
      remainingPurchaseIds = remainingPurchaseIds.slice(1);
      continue;
    }

    let minPurchaseCost = Infinity;
    let cheapestPurchaseId = null;
    remainingPurchaseIds.forEach((purchaseId) => {
      const costsToNetwork = network.map((ownedId) => costHelper[ownedId][purchaseId]);
      const cheapestPath = Math.min(...costsToNetwork);

      if (cheapestPath < minPurchaseCost) {
        minPurchaseCost = cheapestPath;
        cheapestPurchaseId = purchaseId;
      }
    });

    connectionCost += minPurchaseCost;
    network.push(cheapestPurchaseId);
    remainingPurchaseIds = remainingPurchaseIds.filter(id => id !== cheapestPurchaseId);
  }

  const occupancyCost = purchaseIds.reduce((acc, purchaseId) => {
    const numOccupants = game
      .cities
      .find(cityInstance => cityInstance.city.id === purchaseId)
      .players
      .length;

    return acc + 10 + 5 * numOccupants;
  }, 0);

  return connectionCost + occupancyCost;
}