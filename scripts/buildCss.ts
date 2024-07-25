import cssnano from 'cssnano';
import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import postCssImport from 'postcss-import';

const buildCss = async (rootPackagePath: string) => {
    const css = fs.readFileSync(path.join(rootPackagePath, `src/styles/index.css`), { encoding: 'utf8' });
    return new Promise<void>((resolve) => {
        postcss([postCssImport()])
            .process(css, {
                from: `src/styles/index.css`,
                to: `lib/styles/index.css`,
            })
            .then((result) => {
                fs.writeFileSync(path.join(rootPackagePath, `lib/styles/index.css`), result.css);
                resolve();
            });
    });
};

const minifyCss = async (rootPackagePath: string) => {
    const css = fs.readFileSync(path.join(rootPackagePath, `src/styles/index.css`), { encoding: 'utf8' });
    return new Promise<void>((resolve) => {
        postcss([postCssImport(), cssnano()])
            .process(css, {
                from: `src/styles/index.css`,
                to: `lib/styles/index.min.css`,
            })
            .then((result) => {
                fs.writeFileSync(path.join(rootPackagePath, `lib/styles/index.min.css`), result.css);
                resolve();
            });
    });
};

(async () => {
    const rootPackagePath = process.cwd();
    return Promise.all([buildCss(rootPackagePath), minifyCss(rootPackagePath)]);
})();
