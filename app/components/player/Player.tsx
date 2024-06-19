import { useContext, useEffect, useState } from "react";
import { AccessTokenCtx, PlaybackStateCtx, PlayerCtx } from "~/context/ctx";
import { GoogleIcon } from "../GoogleIcon";
import { Devices } from "./Devices";
import { VolumeControls } from "./VolumeControls";
import { prepend0 } from "~/functions/util";

interface PlayerParams {
    playerCtx: React.Context<Spotify.Player | null>,
    playbackStateCtx: React.Context<Spotify.PlaybackState | null>
    ready: boolean
}
export function Player({ playerCtx, playbackStateCtx, ready }: PlayerParams) {
    const token = useContext(AccessTokenCtx);
    const player = useContext(playerCtx);
    const playbackState = useContext(playbackStateCtx);
    useEffect(() => {
        console.log('Player:', !!player, "PS:", !!playbackState);
        if (!player || !playbackState) return;
    }, [player, playbackState]);
    return (
        <div className="w-full h-full grid grid-cols-[20%_1fr_20%] grid-rows-1 items-center justify-between p-4">
            <div className="flex items-center justify-start gap-2">
                <div className="h-16 aspect-square relative rounded-md overflow-hidden">
                    <img src={playbackState ? playbackState.track_window.current_track.album.images[0].url : "/artwork.jpeg"} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center text-sm">
                    <div className="hover:underline cursor-pointer">{playbackState ? playbackState.track_window.current_track.name : 'Track name'}</div>
                    <div className="text-white text-opacity-60 hover:text-opacity-100 cursor-pointer hover:underline">{playbackState ? playbackState.track_window.current_track.artists[0]!.name : 'Track author'}</div>
                </div>
                <div className="flex items-center justify-center w-4 h-4 p-2 text-center text-lg text-white text-opacity-60 hover:text-opacity-100 border-2 border-white/60 hover:border-white cursor-pointer rounded-full">
                    <div>+</div>
                </div>
            </div>
            <PlaybackControls />
            <div className="flex items-center justify-end gap-2">
                <VolumeControls getVolumeLevel={player ? player.getVolume : async()=>0} onUpdateVolumeLevel={(newVolumeLevel)=>{}}/>
                <Devices token={token ? token : ""}/>
            </div>
        </div>
    )
}

function PauseResumeButton({ playing, onToggle: handleToggle }: { playing: boolean, onToggle: (state: boolean) => void }) {
    const [md, setMD] = useState(false);
    return (
        <button className={`h-[2.5rem] w-[2.5rem] flex items-center justify-center`}
            onMouseDown={() => { setMD(true) }}
            onMouseUp={async () => {
                setMD(false);
                handleToggle(!playing);
            }}>
                <GoogleIcon code={playing ? 'play_circle' : 'pause_circle'} filled className={`${md ? 'text-[2.3rem]' : 'text-[2.5rem] hover:text-[2.3rem]'}`}/>
            </button>)
}

function RepeatButton(){
    enum RepeatState {
        NO_REPEAT,
        REPEAT_ONE,
        REPEAT_ALL
    }
    const [repeatState, setRepeatState] = useState<RepeatState>(0);
    return (
        <button title="skip_next" type={"button"} className={`${!!repeatState ? "text-green-500" : "text-white"} text-opacity-60 hover:text-opacity-100 flex justify-center items-center`} onClick={()=>{setRepeatState(s=>s>=2?0:s+1)}}>
            <GoogleIcon code={repeatState ? repeatState == RepeatState.REPEAT_ONE ? "repeat_one_on" : "repeat_on" : "repeat"} className="text-xl" filled />
        </button>
    )
}
function Track({ progress, duration }: { progress: number, duration: number }) {
    const pos = ((progress / duration) * 100).toFixed(2);
    return (
        <div className="w-full h-full rounded-full overflow-hidden bg-white/60">
            <div className="h-full bg-white transition-all" style={{ width: `${pos}%` }}></div>
        </div>
    )
}
function PlaybackControls() {
    const player = useContext(PlayerCtx);
    const playbackState = useContext(PlaybackStateCtx);
    const [position, setPostion] = useState(0);
    const [duration, setDuration] = useState(0);
    useEffect(() => {
        if (!playbackState) return;
        setPostion(playbackState.position);
        setDuration(playbackState.duration);
        const interval = setInterval(() => {
            if (!playbackState.paused) {
                setPostion(p => p + 100);
            }
        }, 100);
        return () => {
            clearInterval(interval);
        }
    }, [playbackState]);
    return (
        <div className="flex flex-col items-center justify-center">
            <div>
                <div className="flex gap-2">
                    <div className={`${(playbackState && playbackState.shuffle) ? "text-green-500" : "text-white/60"} flex justify-center items-center`}>
                        <GoogleIcon code={(playbackState && playbackState.shuffle) ? "shuffle_on":"shuffle"} className="text-xl cursor-default"/>
                    </div>
                    <button title="skip_previous" type={"button"} className={`text-white text-opacity-60 hover:text-opacity-100 flex justify-center items-center`} onClick={() => { player && player.previousTrack() }}>
                        <GoogleIcon code="skip_previous" className="text-2xl" filled/>
                    </button>
                    <PauseResumeButton playing={playbackState ? playbackState.paused : false} onToggle={async (state) => {
                        if (!player) return;
                        // state ? player.resume() : player.pause();
                        player.togglePlay();
                    }} />
                    <button title="skip_next" type={"button"} className={`text-white text-opacity-60 hover:text-opacity-100 flex justify-center items-center`} onClick={() => { player && player.nextTrack() }}>
                        <GoogleIcon code="skip_next"  className="text-2xl" filled/>
                    </button>
                    <RepeatButton/>
                </div>
            </div>
            <div className="w-full grid grid-rows-1 grid-cols-[40px_1fr_40px] grid-flow-col gap-2 items-center justify-items-center text-sm text-white/60">
                <div className="justify-self-end">{!playbackState ? '-:-' : `${prepend0(Math.floor(position / 60000))}:${prepend0(Math.floor((position % 60000) / 1000))}`}</div>
                <div className="w-full h-[5px]">
                    <Track progress={position} duration={duration} />
                </div>
                <div className="justify-self-start">{!playbackState ? '-:-' : `-${prepend0(Math.abs(Math.floor(duration / 60000) - Math.floor(position / 60000)))}:${prepend0(Math.abs(Math.floor((duration % 60000) / 1000) - Math.floor((position % 60000) / 1000)))}`}</div>
            </div>
        </div>
    )
}

