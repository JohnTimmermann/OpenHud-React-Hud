import React, { useEffect, useState } from "react";
import { CSGO } from "csgogsi";
import Layout from "./HUD/Layout/Layout";
import DangerZoneLayout from "./HUD/DangerZone/DangerZoneLayout";
import { getLayoutVariant } from "./HUD/layoutSelector";
import "./App.css";
import { Match } from "./API/types";
import { socket } from "./API/socket";
import api from "./API";
import { GSI } from "./API/HUD";
import { ONGSI } from "./API/contexts/actions";

const App = () => {
  const [game, setGame] = useState<CSGO | null>(null);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  useEffect(() => {
    const onMatchPing = () => {
      api.matches
        .getCurrent()
        .then((match) => {
          if (!match) {
            GSI.teams.left = null;
            GSI.teams.right = null;
            setCurrentMatch(null);
            return;
          }
          setCurrentMatch(match);
          let isReversed = false;
          if (GSI.last) {
            const mapName = GSI.last.map.name.substring(
              GSI.last.map.name.lastIndexOf("/") + 1
            );
            const current = match.vetos.filter(
              (veto) => veto.mapName === mapName
            )[0];
            if (current && current.reverseSide) {
              isReversed = true;
            }
          }
          if (match.left.id) {
            api.teams.getTeam(match.left.id).then((left) => {
              const gsiTeamData = {
                id: left._id,
                name: left.name,
                country: left.country,
                logo: left.logo,
                map_score: match.left.wins,
                extra: left.extra,
              };

              if (!isReversed) {
                GSI.teams.left = gsiTeamData;
              } else GSI.teams.right = gsiTeamData;
            });
          }
          if (match.right.id) {
            api.teams.getTeam(match.right.id).then((right) => {
              const gsiTeamData = {
                id: right._id,
                name: right.name,
                country: right.country,
                logo: right.logo,
                map_score: match.right.wins,
                extra: right.extra,
              };
              if (!isReversed) GSI.teams.right = gsiTeamData;
              else GSI.teams.left = gsiTeamData;
            });
          }
        })
        .catch(() => {
          GSI.teams.left = null;
          GSI.teams.right = null;
          setCurrentMatch(null);
        });
    };
    socket.on("match", onMatchPing);
    onMatchPing();

    return () => {
      socket.off("match", onMatchPing);
    };
  }, []);

  ONGSI(
    "data",
    (game) => {
      setGame(game);
    },
    []
  );

  if (!game) return null;

  const layoutVariant = getLayoutVariant(game);

  if (layoutVariant === "danger_zone") {
    return <DangerZoneLayout game={game} />;
  }

  return <Layout game={game} match={currentMatch} />;
};

export default App;
