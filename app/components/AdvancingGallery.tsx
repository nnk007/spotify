import { ReactNode, useState } from "react";

export function AdvancingGallery({ max, children }: { max: number; children: ReactNode; }) {
    const [offset, setOffset] = useState(0);
    function offsetForward() {
        offset < max ? setOffset(_ => _ + 1) : setOffset(0);
    }
    function offsetBack() {
        offset > 0 ? setOffset(_ => _ - 1) : setOffset(max);

    }
    return (
        <div className="relative overflow-hidden">
            <div className="flex w-[200%] py-2 overflow-y-hidden z-0 transition-transform" style={{ transform: `translate(-${offset * 10}%, 0)` }}>
                {children}
            </div>
            <div className="absolute z-10 hover:bg-white/10 transition-all top-0 left-0 w-[50px] h-full" onClick={() => { offsetBack(); }}></div>
            <div className="absolute z-10 hover:bg-white/10 transition-all top-0 right-0 w-[50px] h-full" onClick={() => { offsetForward(); }}></div>
        </div>
    );
}
