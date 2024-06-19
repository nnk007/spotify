import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import { db } from "db";

export function loader({ request }: LoaderFunctionArgs) {
    try{
        const cookie = request.headers.get("Cookie");
        const matches = /SESSION=(.+);.*/.exec(cookie!)!;
        const session = matches[1];
        const access_token = db.get(session);
        return json({ access_token: access_token});
    } catch(err) {
        return new Response((err as Error).name,{status:400});
    }
}