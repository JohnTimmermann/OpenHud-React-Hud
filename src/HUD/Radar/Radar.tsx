import { CSGO, Player } from "csgogsi";
import LexoRadarContainer from "./LexoRadar/LexoRadarContainer";
import maps from "./LexoRadar/maps";
import dzEmberRadar from "./LexoRadar/maps/dz_ember/radar.jpg";

interface Props {
  radarSize: number;
  game: CSGO;
}

const fallbackBackgrounds: Record<string, string> = {
  dz_ember: dzEmberRadar,
};

const normalizeMapName = (mapName: string) =>
  mapName
    .split(/[\\/]/)
    .pop()
    ?.toLowerCase()
    .replace(/\.bsp$/, "") || mapName.toLowerCase();

const resolveMapKey = (mapName: string) => {
  const normalizedMapName = normalizeMapName(mapName);
  if (normalizedMapName in maps) {
    return normalizedMapName;
  }

  return (
    Object.keys(maps).find(
      (knownMapName) =>
        normalizedMapName === knownMapName ||
        normalizedMapName.startsWith(`${knownMapName}_`) ||
        normalizedMapName.startsWith(knownMapName),
    ) || normalizedMapName
  );
};

const getFallbackBackground = (mapName: string) => {
  if (mapName in fallbackBackgrounds) {
    return fallbackBackgrounds[mapName];
  }
  const prefixedMapName = Object.keys(fallbackBackgrounds).find((knownName) =>
    mapName.startsWith(knownName),
  );
  return prefixedMapName ? fallbackBackgrounds[prefixedMapName] : undefined;
};

const FallbackRadar = ({
  players,
  radarSize,
  mapName,
}: {
  players: Player[];
  radarSize: number;
  mapName: string;
}) => {
  const positionedPlayers = players.filter(
    (player) => Number.isFinite(player.position?.[0]) && Number.isFinite(player.position?.[1]),
  );
  const alivePlayers = positionedPlayers.filter((player) => player.state.health > 0);
  const sourcePlayers = alivePlayers.length ? alivePlayers : positionedPlayers;
  const backgroundImage = getFallbackBackground(mapName);
  const canvasSize = Math.max(180, radarSize);
  const padding = Math.max(12, Math.round(canvasSize * 0.08));
  const innerSize = canvasSize - padding * 2;
  const dotSize = Math.max(16, Math.round(canvasSize * 0.09));
  const fontSize = Math.max(9, Math.round(dotSize * 0.46));

  if (!sourcePlayers.length) {
    return (
      <div className="map-container" style={{ width: radarSize, height: radarSize }}>
        <div
          style={{
            width: `${canvasSize}px`,
            height: `${canvasSize}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(246, 242, 234, 0.72)",
            textAlign: "center",
            fontSize: `${Math.max(12, Math.round(canvasSize * 0.06))}px`,
            fontWeight: 700,
            background:
              `linear-gradient(180deg, rgba(7, 8, 11, 0.62), rgba(7, 8, 11, 0.85)), ${
                backgroundImage ? `url(${backgroundImage})` : "rgba(10, 11, 14, 0.92)"
              }`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          No player data ({mapName})
        </div>
      </div>
    );
  }

  const xs = sourcePlayers.map((player) => player.position[0]);
  const ys = sourcePlayers.map((player) => player.position[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);
  const hasLowSpread = spanX < 8 && spanY < 8;
  const ringRadius = Math.max(20, Math.min(innerSize * 0.36, canvasSize * 0.26));

  return (
    <div className="map-container" style={{ width: radarSize, height: radarSize }}>
      <div
        style={{
          width: `${canvasSize}px`,
          height: `${canvasSize}px`,
          position: "relative",
          background: `linear-gradient(180deg, rgba(7, 8, 11, 0.45), rgba(7, 8, 11, 0.8)), ${
            backgroundImage
              ? `url(${backgroundImage})`
              : "radial-gradient(circle at center, rgba(86, 103, 122, 0.32), rgba(13, 15, 20, 0.96))"
          }`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {sourcePlayers.map((player, index) => {
          const projectedX = padding + ((player.position[0] - minX) / spanX) * innerSize;
          const projectedY =
            canvasSize - (padding + ((player.position[1] - minY) / spanY) * innerSize);
          const ringAngle = (Math.PI * 2 * index) / Math.max(sourcePlayers.length, 1);
          const x = hasLowSpread ? canvasSize / 2 + Math.cos(ringAngle) * ringRadius : projectedX;
          const y = hasLowSpread ? canvasSize / 2 + Math.sin(ringAngle) * ringRadius : projectedY;
          const label =
            player.observer_slot !== undefined
              ? player.observer_slot.toString()
              : (player.name[0] || "?");
          const dotColor = player.team.side === "CT" ? "#4d7fff" : "#f09d3e";

          return (
            <div
              key={`${player.steamid}-${index}`}
              style={{
                position: "absolute",
                transform: "translate(-50%, -50%)",
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.25)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f6f2ea",
                background: dotColor,
                opacity: player.state.health > 0 ? 1 : 0.35,
                left: `${x}px`,
                top: `${y}px`,
                fontSize: `${fontSize}px`,
                fontWeight: 700,
              }}
              title={player.name}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Radar = ({ radarSize, game }: Props) => {
  const { players, player, bomb, grenades, map } = game;
  const mapName = resolveMapKey(map.name);

  if (!(mapName in maps)) {
    return <FallbackRadar players={players} radarSize={radarSize} mapName={mapName} />;
  }

  return (
    <LexoRadarContainer
      players={players}
      player={player}
      bomb={bomb}
      grenades={grenades}
      size={radarSize}
      mapName={mapName}
    />
  );
};

export default Radar;
