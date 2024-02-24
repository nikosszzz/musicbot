/**
* Sleep function with promises 
* 
*/
export function sleep({ ms }: { ms: number }): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}
