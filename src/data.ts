import { GAME_CONFIG } from './constants';

export interface IColorRandom {
  color: string;
  name: string;
  nbr: number;
}

export const createInitialColorsRandom = (): IColorRandom[] => {
  return GAME_CONFIG.COLORS.map(colorInfo => ({
    color: colorInfo.color,
    name: colorInfo.name,
    nbr: Math.floor(Math.random() * 100)
  }));
};
