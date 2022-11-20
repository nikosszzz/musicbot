const keys = "abcdefghijklmnopqrstubwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
let code = "";

export function generateCode({ amt }: { amt: number; }): string {
    code = "";
    for (let i = 0; i < amt; i++) {
        code = code.concat(keys.charAt(Math.floor(Math.random() * keys.length)));
    }
    return code;
}
