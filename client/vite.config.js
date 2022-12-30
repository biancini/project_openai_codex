import { defineConfig } from 'vite';

export default ({ mode }) => {

    return defineConfig({
        server: {
            host: true,
            port: process.env.VITE_PORT,
        },
    });
}