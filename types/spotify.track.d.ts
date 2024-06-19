declare namespace SpotifyWeb {
    interface Tracks {
        href: string;
        limit: number;
        next: string;
        offset: number;
        previous: string;
        total: number;
        items: TrackItem[];
    }
    interface TrackItem {
        added_at: string;
        added_by: UserSelf;
        is_local: boolean;
        track: Track;
    }
    interface Track extends SpotifyWeb.BaseObject{
        type: "track";
        name:string;
        album: Album;
        artists: Artist[];
        available_markets: string[];
        disc_number: number;
        duration_ms: number;
        explicit: boolean;
        external_ids: {
            isrc: string;
            ean: string;
            upc: string;
        };
        external_urls: ExternalUrls;
        is_playable: boolean;
        linked_from: any; // Specify more if you have the structure
        restrictions: Restrictions;
        popularity: number;
        preview_url: string;
        track_number: number;
        is_local: boolean;
    }
}