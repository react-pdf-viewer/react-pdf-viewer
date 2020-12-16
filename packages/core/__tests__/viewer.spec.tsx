import * as React from 'react';
import { render} from '@testing-library/react';

import Viewer from '../src/Viewer';

test('render document that does not exist', async () => {
    const App = () => (
        <div style={{ height: '100px' }}>
            <Viewer
                fileUrl={'file:///../../../assets/not-found.pdf'}
            />
        </div>
    );
    const { findByText } = render(<App />);
    
    const errorMessage = await findByText('Missing PDF "/assets/not-found.pdf".');
    expect(errorMessage).toHaveClass('rpv-core-doc-error-text');
});
