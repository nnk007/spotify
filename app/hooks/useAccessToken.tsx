import { useContext } from "react";
import { AccessTokenCtx } from "~/context/ctx";

export function useAccessToken() {
    const token = useContext(AccessTokenCtx);
    if(!token) throw new Error("token unset");
    return token;
}