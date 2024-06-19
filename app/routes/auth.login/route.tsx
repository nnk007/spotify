import { LoaderFunctionArgs, redirectDocument } from "@remix-run/node";

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export function loader({ }: LoaderFunctionArgs) {
    var scope = "streaming \
                 user-read-email \
                 user-read-private \
                 user-library-read \
                 playlist-read-private \
                 user-read-playback-state \
                 user-modify-playback-state"

    var state = generateRandomString(16);

    var auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri: "https://win10.dog:3000/auth/callback",
        state: state
    });
    return redirectDocument('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString())
}
const generateRandomString = function (length:number) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  