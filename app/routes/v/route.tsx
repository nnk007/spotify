import { db } from "db";
import { commitSession, getSession } from "~/sessions.server";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useOutlet } from "@remix-run/react";
import { usePlayer } from "~/hooks/usePlayer";
import { Profile } from "~/components/profile/Profile";
import { AdvancingGallery } from "~/components/AdvancingGallery";
import { PlaylistItems } from "~/components/PlaylistItems";
import { getFeaturedPlaylists, getMyPlaylists } from "~/functions/playlists";
import { AccessTokenCtx, PlaybackStateCtx, PlayerCtx, UserCtx } from "~/context/ctx";
import { Player } from "~/components/player/Player";
import { useSpotifyUser } from "~/hooks/useUser";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const skey = session.get("sessionKey");
    if (!skey || !db.get(skey)) {
        session.unset("sessionKey");
        return redirect("/login", { headers: { 'Set-Cookie': await commitSession(session) } });
    }
    return json({ access_token: db.get(skey) }, { headers: { 'Set-Cookie': await commitSession(session) } });
}

export default function Route() {
    const { access_token } = useLoaderData<{ access_token: string }>();
    const player = usePlayer({ access_token: access_token });
    const user = useSpotifyUser(access_token);
    const outlet = useOutlet();
    return (
        <AccessTokenCtx.Provider value={access_token}>
            <UserCtx.Provider value={user}>
                <div className="h-screen w-screen bg-black text-white grid grid-rows-[1fr_80px] grid-cols-1 grid-flow-row gap-2">
                    {outlet ?
                        <div className="p-2 gap-2 flex flex-col h-full overflow-hidden">
                            <div className="p-2 rounded-md flex justify-between items-center">
                                <div className="p-2 rounded-md flex gap-2">
                                    <div title="SDK state" className={`transition-all material-symbols-outlined ${player ? "text-green-500" : "text-red-500"}`}>manufacturing</div>
                                    <div title="Player ready state" className={`transition-all material-symbols-outlined ${player?.ready ? "text-green-500" : "text-red-500"}`}>{player?.ready ? 'bigtop_updates' : 'signal_disconnected'}</div>
                                    <div title="Playback state" className={`transition-all material-symbols-outlined ${player?.playbackState ? "text-green-500" : "text-red-500"}`}>{player?.playbackState ? 'music_note' : 'music_off'}</div>
                                </div>
                                <Profile />
                            </div>
                            <Outlet />
                        </div> :
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
                        </div>}
                    <PlayerCtx.Provider value={player && player.player}>
                        <PlaybackStateCtx.Provider value={player && player.playbackState}>
                            <Player playbackStateCtx={PlaybackStateCtx} playerCtx={PlayerCtx} ready={!!player?.ready} />
                        </PlaybackStateCtx.Provider>
                    </PlayerCtx.Provider>
                </div>
            </UserCtx.Provider>
        </AccessTokenCtx.Provider>
    )
}

export function ErrorBoundary() {
    return (
        <div className="w-full h-full grid grid-cols-[20%_1fr_20%] grid-rows-1 items-center justify-between p-4">
            <div className="flex items-center justify-start gap-2">
                <div className="text-red-500">ERROR</div>
                <div className="uppercase">Failed rendering PLAYER</div>
            </div>
            <div></div>
            <div className="flex items-center justify-end gap-2">
                <Link to={""} className="uppercase">Reload</Link>
            </div>

        </div>
    )
}