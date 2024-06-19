import { useContext, useEffect, useState } from "react"
import { UserCtx } from "~/context/ctx";

export function Profile() {
    const user = useContext(UserCtx);
    return (
        <div className="flex justify-end items-center gap-2">
            <div>{user ? user.display_name : 'display_name'}</div>
            <div className="rounded-full overflow-hidden">
                <img src={user ? user.images[0].url : '/artwork.jpeg'} alt="" width={100} height={100} className="w-[50px] aspect-square" /></div>
        </div>
    )
}