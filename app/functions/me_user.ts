export async function checkSavedTrack(token:string,id:string):Promise<boolean>{
    if(!id) throw "No id";
    const res = await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${id}`, { headers: { "Authorization": `Bearer ${token}` } });
    return (await res.json() as boolean[])[0];
}
export async function checkSavedTracks(token:string,ids:string[]):Promise<boolean[]>{
    if(!ids) throw "No id";
    const res = await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${encodeURIComponent(ids.join(','))}`, { headers: { "Authorization": `Bearer ${token}` } });
    return (await res.json() as boolean[])
}