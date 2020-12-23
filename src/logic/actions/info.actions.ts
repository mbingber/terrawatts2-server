import { createAction } from '@reduxjs/toolkit';
import { ActionType } from '../types/gameState';

export const advanceTurn = createAction('Advance turn');
export const setEra = createAction<number>('Set era');
export const advancePhase = createAction('Advance phase');
export const setActionType = createAction<ActionType>('Set action type');
export const setActiveUser = createAction<string>('Set active user');
