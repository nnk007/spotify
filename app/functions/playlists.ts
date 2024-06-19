

export async function getFeaturedPlaylists(token: string): Promise<SpotifyWeb.PlaylistResponse> {
    const res = await fetch('https://api.spotify.com/v1/browse/featured-playlists', { headers: { "Authorization": `Bearer ${token}` } });
    return await res.json();
}

export async function getMyPlaylists(token: string): Promise<SpotifyWeb.Playlists> {
    const res = await fetch('https://api.spotify.com/v1/me/playlists', { headers: { "Authorization": `Bearer ${token}` } });
    return await res.json();
}

export async function getPlaylist(token:string,id:string,fields?:string):Promise<SpotifyWeb.Playlist>{
    const res = await fetch(`https://api.spotify.com/v1/playlists/${id}${fields ? "?fields="+fields:''}`, { headers: { "Authorization": `Bearer ${token}` } });
    return await res.json();
}