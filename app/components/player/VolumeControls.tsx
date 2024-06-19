import { useEffect, useState } from "react";
import { GoogleIcon } from "../GoogleIcon";

export function VolumeControls({ getVolumeLevel,onUpdateVolumeLevel: onUpdateVolume}: { getVolumeLevel:()=>Promise<number>,onUpdateVolumeLevel: (arg0:number)=>void }) {
    const [volumeLevel,setVL] = useState(0);
    useEffect(()=>{
        getVolumeLevel().then(n=>setVL(n*100));
    },[])
    const code = (() => {
        if (volumeLevel == 0) return "no_sound"
        else if (volumeLevel <= 40) return "volume_mute"
        else if (volumeLevel <= 80) return "volume_down"
        else return "volume_up";
    })()
    return (
        <div
        className={`flex items-center justify-center gap-1 text-4xl rounded-md py-1 px-2 hover:bg-white/5 cursor-ns-resize`}
        onWheel={(e)=>{
            const direction = (e.deltaY)>0 ? "down" : "up";
            if(direction=="up" && volumeLevel<100){
                setVL(volumeLevel+10);
            } else if(direction=="down" && volumeLevel>0){
                setVL(volumeLevel-10);
            }
        }}
            >
            <div className="w-[3ch] text-xl text-end">{volumeLevel}</div>
            <GoogleIcon code={code}/>
        </div>
    );
}
