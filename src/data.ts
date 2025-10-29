export interface IColorRandom {
  color: string;
  name: string;
  nbr: number;
}

export const createInitialColorsRandom = (): IColorRandom[] => [
  {
    color: "text-red",
    name: "me",
    nbr: Math.floor(Math.random() * 100),
  },
  {
    color: "text-orange",
    name: "ji",
    nbr: Math.floor(Math.random() * 100),
  },
  {
    color: "text-yellow",
    name: "ku",
    nbr: Math.floor(Math.random() * 100),
  },
  {
    color: "text-green",
    name: "hi",
    nbr: Math.floor(Math.random() * 100),
  },
  {
    color: "text-blue",
    name: "bi",
    nbr: Math.floor(Math.random() * 100),
  },
  {
    color: "text-nila",
    name: "ni",
    nbr: Math.floor(Math.random() * 100),
  },
  {
    color: "text-purple",
    name: "u",
    nbr: Math.floor(Math.random() * 100),
  },
];
