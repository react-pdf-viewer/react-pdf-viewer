const path = require('path');

module.exports = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Otherwise, we will see "Invalid hook call" error
        config.resolve.alias['react'] = path.join(__dirname, '../../node_modules/react');

        return config;
    },
};