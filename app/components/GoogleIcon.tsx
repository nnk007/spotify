export function GoogleIcon({ code, filled, className, style }: { code: string, filled?: boolean, className?: string, style?: React.CSSProperties } = {code:"icon_not_set",className:"",filled:false,style:{}}) {
    return (
        <div className={`material-symbols-outlined ${className}`} style={{
            fontVariationSettings: filled ? "'FILL' 1,'wght' 700,'GRAD' 0,'opsz' 48" : undefined,
            ...style
        }}>
            {code}
        </div>
    );
}
