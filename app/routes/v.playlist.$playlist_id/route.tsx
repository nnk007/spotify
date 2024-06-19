import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { checkSavedTracks } from "~/functions/me_user";
import { getPlaylist } from "~/functions/playlists";
import { prepend0 } from "~/functions/util";
import { useAccessToken } from "~/hooks/useAccessToken";

export function loader({ params }: LoaderFunctionArgs) {
    return params.playlist_id;
}
export default function Route() {
    const id = useLoaderData<string>();
    const token = useAccessToken();
    const [playlist, setPlaylist] = useState<SpotifyWeb.Playlist>();
    const [tracks, setTracks] = useState<(SpotifyWeb.TrackItem & { saved: boolean })[]>()
    useEffect(() => {
        async function fetchPlaylist() {
            const playlist = await getPlaylist(token, id);
            setPlaylist(playlist);
            const ids = playlist.tracks.items.map(ti => ti.track.id);
            const bools = await checkSavedTracks(token, ids);
            const truckSaveStates = new Map<string, boolean>(ids.map((v, i) => [v, bools[i]]));
            const tracks = playlist.tracks.items.map(ti => {
                const saved = truckSaveStates.get(ti.track.id)!;
                return { ...ti, saved: saved }
            });
            setTracks(tracks);
        };
        fetchPlaylist();
    }, [])
    return (
        <div className="h-full grid grid-rows-[20%_80%] grid-cols-1 grid-flow-row overflow-hidden p-2">
            <div className="h-full flex flex-col justify-end items-start p-2">
                <div className="text-white text-3xl">{playlist ? playlist.name : "PLAYLIST_NAME"}</div>
                <div className="text-white/60">{playlist ? playlist.description : "PLAYLIST_DESCRIPTION"}</div>
                <div className="text-white/60">By {playlist ? playlist.owner.display_name : "PLAYLIST_OWNER_DISPLAY_NAME"}</div>
                <div>{playlist ? playlist.tracks.total : "PLAYLIST_TOTAL_TRACKS"} tracks</div>
            </div>
            <div className="grid grid-cols-1 grid-rows-none auto-rows-auto grid-flow-row overflow-y-auto p-2">
                {(tracks ? tracks : []).map((v, i, a) => {
                    return <SongEntry key={v.track.id} trackitem={v} />
                })}
            </div>
        </div>
    )
}

function SongEntry({ trackitem }: { trackitem: (SpotifyWeb.TrackItem & { saved: boolean }) }) {
    return (
        <div className="grid grid-rows-1 grid-cols-4 gap-2 p-2 justify-between">
            <div className="flex items-center justify-start gap-2">
                <div className="h-16 aspect-square relative rounded-md overflow-hidden">
                    <img src={trackitem.track.album.images[0].url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                    <div className="text-white text-lg">{trackitem.track.name}</div>
                    <div className="text-white text-opacity-60 leading-normal">{trackitem.track.artists.map(a => a.name).join(", ")}</div>
                </div>
            </div>
            <div className="w-1/2 mx-auto flex items-center justify-start">
                <div className="text-white/60">{trackitem.track.album.name}</div>
            </div>
            <div className="flex items-center justify-end">
                {trackitem.saved ?
                <div className="text-green-500 text-opacity-60 hover:text-opacity-100 p-2">{"SAVED"}</div> :
                <div className="w-[6ch] text-start text-white text-opacity-0 hover:text-opacity-60 p-2">{"SAVE"}</div>
                }
            </div>
            <div className="flex items-center justify-end gap-2">
                <div className="w-[6ch]">{prepend0(Math.floor(trackitem.track.duration_ms / 60000))}:{prepend0(Math.floor(trackitem.track.duration_ms % 60000 / 1000))}</div>
            </div>
        </div>
    )
}

export function ErrorBoundary() {
    return (
        <div>ERROR RENDERING PLAYLIST</div>
    )
}