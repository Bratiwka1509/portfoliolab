export type Portfolio = {
  id: string;
  teamName: string;
  teamNumber: number;
  season: string;
  level: string;
  stars: number;
  awards: string[];
  cover: string;
};

export const portfolios: Portfolio[] = [
  {
    id: "16091-1",
    teamName: "Team Without a Cool Acronym",
    teamNumber: 16091,
    season: "2023 Centerstage",
    level: "Worlds",
    stars: 5,
    awards: ["Think Award — 3rd Place"],
    cover: "/portfolios/16091-1/cover.png",
  },
];
