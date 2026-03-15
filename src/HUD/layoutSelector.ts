import { CSGO } from "csgogsi";

export type LayoutVariant = "danger_zone" | "competitive";

export const getLayoutVariant = (game: CSGO): LayoutVariant => {
  if (game.map.mode === "survival") {
    return "danger_zone";
  }

  if (game.map.name.startsWith("dz_")) {
    return "danger_zone";
  }

  return "competitive";
};
