import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { db } from "db";
import { commitSession, getSession } from "~/sessions.server";
export async function loader({ request }: LoaderFunctionArgs) {
    console.log("root loader called");
    const session = await getSession(request.headers.get("Cookie"));
    const skey = session.get("sessionKey");
    if (!skey || !db.get(skey)) {
        session.unset("sessionKey");
        return redirect("/login", { headers: { 'Set-Cookie': await commitSession(session) } });
    }
    return redirect("/v", { headers: { 'Set-Cookie': await commitSession(session) } });
    
    return null
}