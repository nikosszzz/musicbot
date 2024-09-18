export class timeConverter {
    private static readonly LABELS = ["day(s)", "hour(s)", "minute(s)", "second(s)"];

    private static formatTime(units: number[]): string {
        const formattedUnits = units.map((value, index) => value ? `${value} ${this.LABELS[index]}` : null);
        const filteredUnits = formattedUnits.filter(Boolean);
        return filteredUnits.length > 0 ? filteredUnits.join(", ") + "." : "0 second(s).";
    }

    public static formatMilliseconds(milliseconds: number): string {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        return this.formatTime([days, hours % 24, minutes % 60, seconds % 60]);
    }

    public static formatSeconds(secs: number): string {
        const minutes = Math.floor(secs / 60) % 60;
        const hours = Math.floor(secs / 3600) % 24;
        const days = Math.floor(secs / 86400);

        return this.formatTime([days, hours, minutes, secs % 60]);
    }
}