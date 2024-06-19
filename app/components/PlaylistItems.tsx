import { useEffect, useState } from "react";
import { SongCard } from "~/components/SongCard";

export function PlaylistItems({ displayNItems: n, init_func }: { displayNItems: number; init_func: () => Promise<SpotifyWeb.PlaylistItem[]>; }) {
    const [items, setItems] = useState<SpotifyWeb.PlaylistItem[]>([]);
    useEffect(() => {
        init_func().then(items => {
            setItems(items);
        });
    }, []);
    return (
        <>
            {items.map((v, i) => {
                if (i >= n) return null;
                return (<SongCard key={i} artists={[v.description]} img_url={v.images[0].url} song_name={v.name} song_url={v.href} />);
            })}
        </>
    );
}


