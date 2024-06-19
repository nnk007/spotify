declare namespace SpotifyWeb {
    interface User extends SpotifyWeb.BaseUser {
        images: SpotifyWeb.Image[]
    }
    interface Owner extends SpotifyWeb.BaseUser { }
    type SpotifySubscriptionLevel = "premium" | "free"| "open";
    interface UserSelf extends SpotifyWeb.User {
        country: string;
        email: string;
        explicit_content: {
            filter_enabled: boolean;
            filter_locked: boolean;
        };
        product: SpotifySubscriptionLevel;
    }

}
