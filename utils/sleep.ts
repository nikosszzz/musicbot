/**
* Sleep function with promises 
* 
*/
export function sleep({ ms }: { ms: number; }): Promise<unknown> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
