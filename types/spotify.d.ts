declare namespace SpotifyWeb {
    type SpotifyURI = string;
    type SpotifyUID = string;
    type SpotifyID = string;
    type SpotifyCategoryID = string;
    type SpotifyURL = string;
    /*  */
    interface Image {
        url: string;
        height: number;
        width: number;
    }
    interface ExternalUrls {
        spotify: SpotifyURL;
    }
    interface Followers {
        href: string;
        total: number;
    }
    interface Restrictions {
        reason: string;
    }
    interface Device {
        id: string;
        is_active: boolean;
        is_private_session: boolean;
        is_restricted: boolean;
        name: string;
        type: string;
        volume_percent: number;
        supports_volume: boolean;
    }
    interface DevicesResponse {
        devices: Device[];
    }
    interface BaseObject {
        id: SpotifyID;
        type: string;
        href: string,
        uri: SpotifyURI,
    }
    interface BaseUser extends BaseObject {
        type: "user";
        id:SpotifyUID;
        display_name: string;
        external_urls: ExternalUrls;
        followers: Followers;
    }

}