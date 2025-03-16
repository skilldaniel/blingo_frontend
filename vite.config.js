import viteImagemin from 'vite-plugin-imagemin';
import viteCompression from 'vite-plugin-compression';

export default {
    base: './',
    server: {
        host: true,
        port: 8000,
    },
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    build: {
        // chunkSizeWarningLimit: 1000, // Set the limit (in kB) as desired
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // Separate Pixi.js and related plugins into their own chunks
                        if (id.includes('pixi.js') || id.includes('@pixi')) {
                            if (id.includes('sound')) {
                                return 'pixi-sound'; // Pixi Spine plugin
                            }
                            if (id.includes('spine-pixi')) {
                                return 'pixi-spine'; // Pixi Sprite plugin
                            }
                            if (id.includes('compressed')) {
                                return 'compressed'; // Pixi Sprite plugin
                            }
                            return 'pixi-core'; // Core Pixi.js library and modules
                        }
                        if (id.includes('esotericsoftware')) {
                            return 'esotericsoftware'; // Pixi Sprite plugin
                        }
                        if (id.includes('typed-signals')) {
                            return 'typed-signals'; // Pixi Sprite plugin
                        }
                        if (id.includes('gsap')) {
                            return 'gsap'; // GSAP animation library
                        }
                        // Separate vendor libraries into a common chunk
                        return 'vendor';
                    }

                    if (id.includes('/src/ui/')) {
                        return 'ui';
                    }

                    // Group assets (e.g., textures, shaders) into a separate chunk
                    if (id.endsWith('.json') || id.endsWith('.glsl')) {
                        return 'assets';
                    }

                    return null; // Default: no additional splitting
                },
            },
        },
    },
    plugins: [
        viteCompression({
            algorithm: 'gzip', // or 'brotliCompress' for Brotli compression
            ext: '.gz', // File extension for compressed files
            threshold: 10240, // Only compress files larger than 10 KB
        }),
        viteImagemin({
            gifsicle: {
                optimizationLevel: 7,
                interlaced: false,
            },
            optipng: {
                optimizationLevel: 7,
            },
            mozjpeg: {
                quality: 75,
            },
            pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
            },
            svgo: {
                plugins: [
                    {
                        name: 'removeViewBox',
                        active: false,
                    },
                    {
                        name: 'removeEmptyAttrs',
                        active: true,
                    },
                ],
            },
        }),
    ],
};
