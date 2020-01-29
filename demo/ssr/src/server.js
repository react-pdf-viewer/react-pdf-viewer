import express from 'express';
import fs from 'fs';
import path from 'path';

import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

const PORT = 8001;
const app = express();
const router = express.Router();

const serverRenderer = (req, res, next) => {
    fs.readFile(path.resolve('./dist/index.html'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error');
        }
        return res.send(
            data.replace(
                '<div id="root"></div>',
                `<div id="root">${renderToString(<App/>)}</div>`
            )
        );
    });
};

router.use('^/$', serverRenderer);
router.use(express.static(path.resolve( __dirname, '../dist')));

app.use(router);

app.listen(PORT, () => {
    console.log(`SSR running on http://localhost:${PORT}`);
});
