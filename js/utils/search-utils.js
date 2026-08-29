export function normalizeText(value) {
    return String(value)
        .trim()
        .toLocaleLowerCase("fa-IR")
        .replace(/ي/g, "ی")
        .replace(/ى/g, "ی")
        .replace(/ك/g, "ک")
        .replace(/\u200c/g, " ")
        .replace(/\s+/g, " ");
}