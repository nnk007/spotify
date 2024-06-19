export default function Route() {
    return (
        <div className="h-screen w-screen bg-[#111] flex items-center justify-center">
            <div className="w-1/2 h-1/2 rounded-md shadow-md flex items-center justify-center bg-black">
                <a className="rounded-md p-4 bg-[#000] text-white hover:bg-[#0f0f0f] transition-all border shadow-white shadow border-white" href="/auth/login" >
                    Login with Spotify
                </a>
            </div>
        </div>
    )
}