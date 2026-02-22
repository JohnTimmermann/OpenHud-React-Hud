import { Team } from "csgogsi";
import * as I from "../../API/types";
import { apiUrl } from "./../../API";
import { LogoCT, LogoT } from "../../assets/Icons";

const TeamLogo = ({
  team,
  height,
  width,
}: {
  team?: Team | I.Team | null;
  height?: number;
  width?: number;
}) => {
  if (!team) return null;
  let id = "";
  const { logo } = team;
  if ("_id" in team) {
    id = team._id;
  } else if ("id" in team && team.id) {
    id = team.id;
  }
  // ${apiUrl}/teams/${id}/logo - Old way of getting the logo
  return (
    <div className={`logo`}>
      {logo && id ? (
        <img
          src={`${apiUrl + logo}`}
          width={width}
          height={height}
          alt={"Team logo"}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default TeamLogo;
