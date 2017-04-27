module.exports = {
    OVERRIDE_DOCUMENT_CLIENT: null,
    TABLE_PACKAGE: process.env.TABLE_PACKAGE || 'VersionWatcherPackage',
    TABLE_VERSION: process.env.TABLE_VERSION || 'VersionWatcherVersion,
    TABLE_STABLE: process.env.TABLE_STAGE || 'VersionWatcherStable'
}
