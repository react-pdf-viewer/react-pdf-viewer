import * as React from 'react';
import { render } from '@testing-library/react';

import Viewer from '../src/Viewer';

test('render document', () => {
    const App = () => (
        <Viewer
            fileUrl={'assets/pdf-open-parameters'}
        />
    );
    const output = render(<App />);
    expect(output.getByText('hello')).toBeInTheDocument();
});
