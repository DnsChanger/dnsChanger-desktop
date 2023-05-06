import dotenv from 'dotenv';

import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './_config/webpack.main.config';
import { rendererConfig } from './_config/webpack.renderer.config';

const plugins: any[] = [
    new WebpackPlugin({
        mainConfig,
        devContentSecurityPolicy: [
            'default-src \'self\' \'unsafe-inline\' data:;',
            'script-src \'self\' \'unsafe-eval\' \'unsafe-inline\' data:;',
            'img-src \'self\' blob: data: https://via.placeholder.com',
        ].join(' '),
        renderer: {
            config: rendererConfig,
            entryPoints: [
                {
                    html: './src/renderer/index.html',
                    js: './src/renderer.ts',
                    name: 'main_window',
                    preload: {
                        js: './src/preload.ts',
                    },
                },
                {
                    name: "loading_window",
                    html: './src/renderer/loading_window/loading.html',
                    js: "./src/renderer/loading_window/renderer.ts",
                }
            ],
        },
    }),
]
dotenv.config();
if (!process.env.ENV) {
    plugins.push({
        name: '@electron-forge/plugin-auto-unpack-natives',
        config: {

        }
    },
        {
            name: '@electron-forge/plugin-electronegativity',
            config: {
                isSarif: true
            }
        },)
}

const config: ForgeConfig = {
    packagerConfig: {
        win32metadata: {
            'requested-execution-level': 'requireAdministrator',
            OriginalFilename: 'dnsChanger'
        },
        icon: './assets/icon',
        asar: !!!process.env.ENV
    },
    rebuildConfig: {},
    makers: [
        new MakerSquirrel({}),
        new MakerDeb({}),
        new MakerRpm({})
    ],
    plugins,
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'DnsChanger',
                    name: 'dnsChanger-desktop',
                    authToken: process.env.GITHUB_TOKEN,
                },
                prerelease: false,
                draft: true,
                tagPrefix: "v"
            }
        }
    ]
};

export default config;
