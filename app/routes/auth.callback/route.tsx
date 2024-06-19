import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { randomUUID } from "crypto";
import { db } from "db";
import https from "https";
import { commitSession, getSession } from "~/sessions.server";
const spotify_client_id = 'c9d0b93efa5f4a3487717ed27c3b5b7d';
const spotify_client_secret = 'd434e83839af40fabce1787457f220be';

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    if (!code) throw "No code";
    let sessionKey = '';
    const session = await getSession(request.headers.get('Cookie'));
    if(!session.has("sessionKey")){
        sessionKey = randomUUID();
        session.set("sessionKey",sessionKey);
    } else {
        sessionKey = session.get("sessionKey")!;
    }

    let form = new FormData();
    form.set("code", code);
    form.set("redirect_uri", "http://localhost:3000/auth/callback");
    form.set("grant_type", "authorization_code");
    const formdata = [...form.entries()].map(v => {
        return encodeURIComponent(v[0]) + "=" + encodeURIComponent(v[1] as string);
    }).join('&');

    try {
        const req = https.request(`https://accounts.spotify.com/api/token`, {
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: "POST"
        });
        req.end(formdata)
        req.on("error", (err) => {
            console.error(err);
        })
        await new Promise((resolve, reject) => {
            req.on('response', async (res) => {
                console.log(res.statusCode, res.errored);
                const rawBody: Buffer = await new Promise((resolve, reject) => {
                    let b = Buffer.from([]);
                    res.on('data', c => b = Buffer.concat([b, c]));
                    res.on('end', () => resolve(b));
                })
                console.log(rawBody.toString());
                if (res.statusCode !== 200 || res.errored) throw 'dog';
                const { access_token } = JSON.parse<{ access_token: string }>(rawBody.toString());
                db.set(sessionKey, access_token);
                resolve(1);
            });
        });
        return redirect("/",{headers:{
            "Set-Cookie":await commitSession(session)
        }});
    } catch (err) {
        console.error(err);
        return new Response("500", { status: 500 });
    }
}