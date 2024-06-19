interface stringJSON<T> { };
interface JSON {
    parse<T>(text: stringJSON<T>, reviver?: (this: any, key: string, value: any) => any): T;
}

declare namespace NodeJS {
    interface ProcessEnv {
        SPOTIFY_CLIENT_SECRET:string,
        SPOTIFY_CLIENT_ID:string
    } 
}