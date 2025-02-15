import * as I from "csgogsi";
import { Match } from "../../API/types";

interface Props {
  map: I.Map;
  match: Match | null;
}

const SeriesBox = ({ map, match }: Props) => {
  const amountOfMaps =
    (match && Math.floor(Number(match.matchType.substr(-1)) / 2) + 1) || 0;
  const bo = (match && Number(match.matchType.substr(-1))) || 0;
  const left = map.team_ct.orientation === "left" ? map.team_ct : map.team_t;
  const right = map.team_ct.orientation === "left" ? map.team_t : map.team_ct;
  return (
    <div id="encapsulator">
      <div className="container left">
        <div className={`series_wins left `}>
          <div className={`wins_box_container`}>
            {new Array(amountOfMaps).fill(0).map((_, i) => (
              <div
                key={i}
                className={`wins_box ${
                  left.matches_won_this_series > i ? "win" : ""
                } ${left.side}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="container right">
        <div className={`series_wins right `}>
          <div className={`wins_box_container`}>
            {new Array(amountOfMaps).fill(0).map((_, i) => (
              <div
                key={i}
                className={`wins_box ${
                  right.matches_won_this_series > i ? "win" : ""
                } ${right.side}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesBox;
