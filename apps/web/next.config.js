//@ts-check

const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
    // Use this to set Nx-specific options
    // See: https://nx.dev/recipes/next/next-config-setup
    nx: {},
    async rewrites() {
        const apiPort = process.env.API_PORT || '8080';
        return [
            {
                source: '/api/:path*',
                destination: `http://localhost:${apiPort}/v1/api/:path*`,
            },
        ];
    },
};

const plugins = [
    // Add more Next.js plugins to this list if needed.
    withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
