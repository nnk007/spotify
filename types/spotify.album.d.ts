declare namespace SpotifyWeb {
  interface Album extends SpotifyWeb.BaseObject{
    type:"album";
    name:string;
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: ExternalUrls;
    images: Image[];
    release_date: string;
    release_date_precision: string;
    restrictions: Restrictions;
    artists: Artist[];
  }
}