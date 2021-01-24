import { makePlayerMoney } from '../logic/actions/players.actions';
import { StatReducer } from './getStat';
import { Phase } from '../logic/types/gameState';

export type SpendEarnSummary = Array<{
  username: string;
  plantSpend: number;
  resourceSpend: number;
  citySpend: number;
  earn: number;
}>

export const spendEarnSummaryReducer: StatReducer<SpendEarnSummary> = (summary, state, action) => {
  if (action.type === makePlayerMoney.type) {
    const { name, amount } = action.payload;
    if (!name) console.log("NAMELESS ACTION", action);
    const player = summary.find(s => s.username === name);
    if (state.info.phase === Phase.PLANT) {
      player.plantSpend -= amount;
    } else if (state.info.phase === Phase.RESOURCE) {
      player.resourceSpend -= amount;
    } else if (state.info.phase === Phase.CITY) {
      player.citySpend -= amount;
    } else if (state.info.phase === Phase.POWER) {
      player.earn += amount;
    }
  }
  
  return summary;
};
