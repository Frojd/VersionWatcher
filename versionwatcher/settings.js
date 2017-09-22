function getSettings() {
    return {
        TABLE_VERSION:
            process.env.TABLE_VERSION || "fallback-VersionWatcherVersion",
        TABLE_PACKAGE:
            process.env.TABLE_PACKAGE || "fallback-VersionWatcherPackage",
        TABLE_STABLE:
            process.env.TABLE_STABLE || "fallback-VersionWatcherStable",
        WATCH_WEBHOOK: process.env.WATCH_WEBHOOK || null,
        IFTTT_KEY: process.env.IFTTT_KEY || null
    };
}

module.exports = {
    getSettings
};
