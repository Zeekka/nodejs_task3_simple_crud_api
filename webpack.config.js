import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = fileURLToPath(path.dirname(import.meta.url));

export default {
    target: "node",
    mode: "production",
    devtool: "inline-source-map",
    entry: './dist/index.js',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['', '.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.cjs',
        path: path.join(__dirname, 'bundle'),
    },
};
