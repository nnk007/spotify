import { useState } from "react";

export function SongCard({ artists: _artists, img_url: img, song_name, song_url: url }: { song_name: string; artists: string[]; img_url: string; song_url: string; }) {
    const [artists, setArtists] = useState(_artists);
    const [hovering, setHovering] = useState(false);
    return (
        <div className=" overflow-hidden w-full hover:bg-white/5 p-3 rounded-md flex flex-col gap-2" onMouseLeave={ev => { setHovering(false); }} onMouseOver={(ev) => { setHovering(true); }}>
            <div className="relative z-0 flex items-center justify-center">
                <img src={img} alt="" className="z-0 w-[100px] lg:w-[200px] aspect-square object-cover rounded-md overflow-hidden" />
                <div className="absolute top-0 left-0 flex justify-end items-end w-full h-full cursor-pointer z-10 p-2">
                    <div className={`rounded-full bg-green-500 hover:contrast-125 hover:scale-105 w-[50px] h-[50px] flex items-center justify-center shadow-md shadow-black/50 ${hovering ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"} transition-all duration-200`}>
                        <div className='material-symbols-outlined filled text-black text-3xl'>play_arrow</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <a href={url} className="hover:underline text-lg leading-5 font-semibold text-ellipsis max-w-full overflow-hidden whitespace-nowrap">{song_name}</a>
                <div className="text-sm text-white/60 max-w-full text-ellipsis">
                    {artists.map((artist, i) => {
                        if (artists.length > 1 && i !== 0) {
                            return (
                                <div key={i} className="inline-block">
                                    <span>{", "}</span>
                                    <div className="inline-block hover:text-white hover:underline">
                                        {artist}
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div key={i} className="inline-block hover:text-white hover:underline max-w-full text-ellipsis overflow-hidden whitespace-nowrap">
                                    {artist}
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
}
