import { useEffect, useState } from "react";

export function usePlayer({ access_token }: { access_token: string; }) {
    if (!access_token) return null;
    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [ready, setReady] = useState(false);
    const [playbackState, setPlaybackState] = useState<Spotify.PlaybackState | null>(null);
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
        script.onload = (ev => {
            console.log("SDK script load");
        });
        /*  */
        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log('SpotifyWebPlaybackSDKReady');
            const _player = new window.Spotify.Player({
                name: 'Dog SDK Player',
                getOAuthToken(cb) {
                    cb(access_token);
                },
                volume: 0.5
            });
            _player.addListener('initialization_error', ({ message }) => {
                console.error('InitErr',message);
            });
            _player.addListener('authentication_error', ({ message }) => {
                console.error('AuthErr',message);
            });
            _player.addListener('account_error', ({ message }) => {
                console.error('AccErr',message);
            });
            _player.addListener('playback_error', ({ message }) => {
                console.error('PlaybackErr',message);
            });
            _player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setReady(true);
            });
            _player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
                setReady(false);
            });
            _player.addListener('player_state_changed', (s) => {
                console.log('State:', s);
                setPlaybackState(s);
            });
            setPlayer(_ => _player);
        };
    }, []);
    useEffect(() => {
        if (!player) return;
        player.connect();
    }, [player]);
    return { player: player, playbackState: playbackState, ready: ready };
}
