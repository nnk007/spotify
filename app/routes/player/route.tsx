/* import { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { db } from "db";
import { createContext, useContext } from "react";
import { Player } from "~/components/player/Player";
import { Profile } from "~/components/profile/Profile";
import { getSession } from "~/sessions.server";
import { AdvancingGallery } from "~/components/AdvancingGallery";
import { usePlayer } from "~/hooks/usePlayer";
import { PlaylistItems } from "../../components/PlaylistItems";

export async function loader({ request }: LoaderFunctionArgs) {
    console.log(db);
    const session = await getSession(request.headers.get("Cookie"));
    const skey = session.get("sessionKey");
    if (!skey || !db.get(skey)) return redirect("/login");
    return json({ access_token: db.get(skey) });
}

export const PlaybackStateCtx = createContext<Spotify.PlaybackState | null>(null);
export const PlayerCtx = createContext<Spotify.Player | null>(null);
export const AccessTokenCtx = createContext<string | null>(null);
export default function Route() {
    const { access_token } = useLoaderData<{ access_token: string }>();
    const player = usePlayer({ access_token: access_token });
    return (
        <AccessTokenCtx.Provider value={access_token}>
            <div className="h-screen w-screen bg-black text-white grid grid-rows-[1fr_80px] grid-cols-1 grid-flow-row gap-2">
                <div className="p-2 gap-2 flex flex-col h-full">
                    <div className="p-2 rounded-md flex justify-between items-center">
                        <div className="p-2 rounded-md flex gap-2">
                            <div title="SDK state" className={`transition-all material-symbols-outlined ${player ? "text-green-500" : "text-red-500"}`}>manufacturing</div>
                            <div title="Player ready state" className={`transition-all material-symbols-outlined ${player?.ready ? "text-green-500" : "text-red-500"}`}>{player?.ready ? 'bigtop_updates' : 'signal_disconnected'}</div>
                            <div title="Playback state" className={`transition-all material-symbols-outlined ${player?.playbackState ? "text-green-500" : "text-red-500"}`}>{player?.playbackState ? 'music_note' : 'music_off'}</div>
                        </div>
                        <Profile />
                    </div>
                    <div className="p-2 flex flex-col rounded-md">
                        <div className="text-3xl font-bold px-2">Your playlists</div>
                        <AdvancingGallery max={5}>
                            <PlaylistItems displayNItems={20} init_func={async () => {
                                const pResp = await getMyPlaylists(access_token);
                                return pResp.items;
                            }} />
                        </AdvancingGallery>
                    </div>
                    <div className="p-2 flex flex-col rounded-md">
                        <div className="text-3xl font-bold px-2">Featured playlists</div>
                        <AdvancingGallery max={5}>
                            <PlaylistItems displayNItems={20} init_func={async () => {
                                const pResp = await getFeaturedPlaylists(access_token);
                                return pResp.playlists.items;

                            }} />
                        </AdvancingGallery>
                    </div>
                </div>
                <PlayerCtx.Provider value={player && player.player}>
                    <PlaybackStateCtx.Provider value={player && player.playbackState}>
                        <Player playbackStateCtx={PlaybackStateCtx} playerCtx={PlayerCtx} ready={!!player?.ready} />
                    </PlaybackStateCtx.Provider>
                </PlayerCtx.Provider>
            </div>
        </AccessTokenCtx.Provider>
    )
}

 */