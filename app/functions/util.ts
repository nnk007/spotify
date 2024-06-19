
export function prepend0(arg0: number): string {
    return arg0 < 10 ? '0' + arg0 : '' + arg0;
}
