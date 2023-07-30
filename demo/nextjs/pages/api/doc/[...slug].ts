import fs from 'fs';
import { type NextApiRequest, type NextApiResponse } from 'next';
import path from 'path';

export const config = {
    api: {
        responseLimit: false,
    },
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const slug = (req.query.slug as string[]).join('/');

    const documentPath = slug.endsWith('.pdf') ? slug : `${slug}.pdf`;
    const filePath = path.resolve('.', `../../samples/${documentPath}`);

    const fileSize = fs.statSync(filePath).size;
    res.writeHead(200, {
        'Accept-Ranges': 'bytes',
        'Content-Length': fileSize,
        'Content-Type': 'application/pdf',
    });

    const readStream = fs.createReadStream(filePath, {
        highWaterMark: 512,
    });
    readStream.pipe(res);
};

export default handler;
