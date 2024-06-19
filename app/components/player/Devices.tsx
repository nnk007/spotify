import { useContext, useEffect, useState } from "react";

export function Devices({token}:{token:string}) {
    const [menuOpen, setMO] = useState(false);
    const [devices, setDevices] = useState<SpotifyWeb.Device[]>([]);
    useEffect(() => {
        if (!token) return;
        getAvailableDevices(token).then(devices => {
            setDevices(devices.devices);
        })
    }, [menuOpen])
    return (
        <div className="relative flex items-center justify-center">
            <button className='material-symbols-outlined hover:text-green-500 z-0' onClick={() => { setMO(!menuOpen) }}>devices</button>
            {menuOpen && <div className="absolute z-20 bg-[#121212] flex flex-col p-2 gap-4 bottom-10 right-0 w-auto h-auto rounded-md">
                <div className="text-white font-semibold">Connect to a device</div>
                {
                    devices.length == 0 ?
                        <div className="text-white/60">{"No device available for connection"}</div> :
                        <>
                            {devices.map(device => {
                                return <button key={device.id} className={`flex flex-col gap-2 ${device.is_active ? "text-green-500" : "text-white/60 hover:text-white/100"}`} onClick={() => {
                                    transferPlayback(device.id, token!);
                                    getAvailableDevices(token!).then(devices => {
                                        setDevices(devices.devices);
                                    })
                                }}>
                                    <div className="text-lg max-w-full whitespace-nowrap overflow-hidden text-ellipsis">{device.name}</div>
                                    <div>{device.type}</div>
                                </button>
                            })}
                        </>
                }
            </div>}
        </div>
    )
}

async function getAvailableDevices(token: string): Promise<SpotifyWeb.DevicesResponse> {
    const res = await fetch('https://api.spotify.com/v1/me/player/devices', { headers: { "Authorization": `Bearer ${token}` } });
    return await res.json();
}

async function transferPlayback(deviceID: string, token: string) {
    const res = await fetch('https://api.spotify.com/v1/me/player', { method: "PUT", headers: { "Authorization": `Bearer ${token}` }, body: JSON.stringify({ device_ids: [deviceID], play: true }) },);
    return null;
}