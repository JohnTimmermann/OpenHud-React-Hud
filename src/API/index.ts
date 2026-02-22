import * as Types from "./types";
import { MapConfig } from "../HUD/Radar/LexoRadar/maps";

const query = new URLSearchParams(window.location.search);
// export const port = Number(query.get('port') || 1349);
export const isDev = !query.get("isProd");
export const HOST = "http://localhost";
export const port = 1349;
// export const variant = query.get("variant") || "default";

// export const isDev = !query.get("isProd");

// export const config = { apiAddress: isDev ? `http://localhost:${port}/` : "/" };
export const apiUrl = `${HOST}:${port}`;
// export const apiUrl = config.apiAddress;

export const apiRequest = async (url: string, method = "GET", body?: any) => {
  const options: RequestInit = {
    method,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  let data: any = null;
  return fetch(`${apiUrl}/${url}`, options).then((res) => {
    data = res;
    return res.json().catch((_e) => data && data.status < 300);
  });
};

export const api = {
  matches: {
    getAll: async (): Promise<Types.Match[]> => apiRequest(`matches`),
    getCurrent: async (): Promise<Types.Match> => apiRequest(`current_match`),
  },
  teams: {
    getAll: async (): Promise<Types.Team[]> => apiRequest(`teams`),
    getTeam: async (id: string): Promise<Types.Team> =>
      apiRequest(`teams/${id}`),
  },
  players: {
    getAll: async (steamids?: string[]): Promise<Types.Player[]> =>
      apiRequest(
        steamids ? `players?steamids=${steamids.join(";")}` : `players`
      ),
    // getAvatarURLs: async (
    //   steamid: string
    // ): Promise<{ custom: string; steam: string }> =>
    //   apiRequest(`players/avatar/steamid/${steamid}`),
  },
  maps: {
    get: (): Promise<{ [key: string]: MapConfig }> => apiRequest("radar/maps"),
  },
};

export default api;
