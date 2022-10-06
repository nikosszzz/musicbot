export class timeConverter {
    public static formatMilliseconds(milliseconds: number): string {
        const asSeconds = milliseconds / 1000;

        let hours = undefined;
        let minutes = Math.floor(asSeconds / 60);
        const seconds = Math.floor(asSeconds % 60);

        if (minutes > 59) {
            hours = Math.floor(minutes / 60);
            minutes %= 60;
        }

        return hours
            ? `${hours} hour(s), ${minutes} minute(s), ${seconds} second(s).`
            : `${minutes} minute(s), ${seconds} second(s).`;
    }

    public static formatSeconds(secs: number): string {
        let days = 0;
        let hours = 0;
        let minutes: number = Math.floor(secs / 60);
        const seconds: number = Math.floor(secs % 60);

        if (minutes > 59) {
            hours = Math.floor(minutes / 60);
            minutes %= 60;
        }

        if (hours as number > 23) {
            days = Math.floor(hours as number / 24) as number;
            (hours as number) %= 24;
        }

        return days
            ? `${days} day(s), ${hours} hour(s), ${minutes} minute(s), ${seconds} second(s).`
            : `${hours} hour(s), ${minutes} minute(s), ${seconds} second(s).`;
    }
}
