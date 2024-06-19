import { createContext } from "react";

export const PlaybackStateCtx = createContext<Spotify.PlaybackState | null>(null);
export const PlayerCtx = createContext<Spotify.Player | null>(null);
export const AccessTokenCtx = createContext<string | null>(null);
export const UserCtx = createContext<SpotifyWeb.UserSelf | null>(null);
