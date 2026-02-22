import React, { useState, useEffect } from "react";
import { Skull, playerCT, playerT } from "../../assets/Icons";
import axios from "axios";
import { apiUrl } from "../../API";

interface AvatarProps {
  steamid: string;
  teamId?: string | null;
  slot?: number;
  height?: number;
  width?: number;
  showSkull?: boolean;
  showCam?: boolean;
  sidePlayer?: boolean;
  teamSide?: string;
  flashed?: number | undefined;
}

const getAvatar = async (steamid: string) => {
  try {
    const player = await axios.get(`http://localhost:1349/players/${steamid}`);
    if (player.data.avatar) {
      return player.data.avatar;
    }
    return null;
  } catch (error) {
    console.error("Error fetching avatar:", error);
    // Implement fallback logic (e.g., return default avatar URL)
  }
};

const Avatar = ({
  steamid,
  teamId,
  slot,
  height,
  width,
  showSkull,
  showCam,
  sidePlayer,
  teamSide,
  flashed,
}: AvatarProps) => {
  const flashValue = flashed ? (flashed < 100 ? 100 : flashed * 2) : 100;
  const defaultPic = teamSide === "CT" ? playerCT : playerT;
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const avatarUrl = await getAvatar(steamid);
        setAvatar(avatarUrl && apiUrl + avatarUrl);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAvatar();
  }, [steamid]);

  return (
    <div className={"avatar"}>
      <img
        src={avatar || defaultPic}
        height={height}
        width={width}
        alt={"Avatar"}
        style={{ filter: `brightness(${flashValue}%)` }}
      />
    </div>
  );
};

export default Avatar;
