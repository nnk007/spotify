import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { commitSession, getSession } from "~/sessions.server";
export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    if(session.has("sessionKey")) return redirect("/");
    return new Response(null,{headers:{
        'Set-Cookie': await commitSession(session)
    }});
}
export default function Route() {
    return (
       <Outlet/>
    )
}