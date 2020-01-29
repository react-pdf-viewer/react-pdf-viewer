require('@babel/register')({
    plugins: [
        ['module-resolver', {
            'root': ['.'],
            'alias': {
                'pdfviewer': './vendors/pdfviewer'
            }
        }]
    ],
    presets: [
        '@babel/preset-env',
        '@babel/preset-react'
    ]
});
require('./src/server');
