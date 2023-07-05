import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const slug = (req.query.slug as string[]).join('');
    const documentPath = slug.endsWith('.pdf') ? slug : `${slug}.pdf`;
    const filePath = path.resolve('.', `../../samples/${documentPath}`);

    res.setHeader('Content-Type', 'application/pdf');
    const documentContent = fs.readFileSync(filePath);
    return res.send(documentContent);
}

export default handler;
