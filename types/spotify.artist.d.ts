interface Artist extends SpotifyWeb.BaseObject {
  type: "artist";
  name:string;
  external_urls: ExternalUrls;
  followers?: Followers;
  genres?: string[];
  images?: Image[];
  popularity?: number;
}
