import { useEffect, useState } from "react";

export function useSpotifyUser(token:string):SpotifyWeb.UserSelf;
export function useSpotifyUser(token: string, target_user_id: string):SpotifyWeb.User;
export function useSpotifyUser(token: string, target_user_id?: string) {
    const [user, setUser] = useState<SpotifyWeb.User | null>(null);
    useEffect(() => {
        async function f() {
            const res = await fetch(target_user_id ? `https://api.spotify.com/v1/users/${target_user_id}`:`https://api.spotify.com/v1/me`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) return;
            const user = await res.json() as SpotifyWeb.User;
            setUser(user);
        };
        f();
    }, [token, target_user_id])
    return user;
}