declare namespace SpotifyWeb {
    interface PlaylistResponse {
        message: string;
        playlists: Playlists;
    }
    interface Playlists {
        href: string;
        limit: number;
        next: string;
        offset: number;
        previous: string;
        total: number;
        items: PlaylistItem[];
    }
    interface Playlist extends SpotifyWeb.BaseObject {
        type: "playlist";
        name:string;
        collaborative: boolean;
        description: string;
        external_urls: ExternalUrls;
        followers: Followers;
        images: Image[];
        owner: UserSelf;
        public: boolean;
        snapshot_id: string;
        tracks: Tracks;
    }
    interface PlaylistItem extends SpotifyWeb.BaseObject{
        type: "playlist";
        name:string;
        collaborative: boolean;
        description: string;
        external_urls: ExternalUrls;
        images: Image[];
        owner: Owner;
        public: boolean;
        snapshot_id: string;
        tracks: Tracks;
    }
}