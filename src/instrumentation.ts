export async function register() {
    if (typeof window === "undefined") {
        // Node.js v25 has a broken localStorage globally defined.
        // We remove it to prevent libraries from incorrectly detecting browser environment.
        // @ts-ignore
        if (typeof global.localStorage !== "undefined") {
            // @ts-ignore
            delete global.localStorage;
        }
    }
}
