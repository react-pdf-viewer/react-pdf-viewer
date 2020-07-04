/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';

import CheckIcon from '../icons/CheckIcon';
import CommentIcon from '../icons/CommentIcon';
import HelpIcon from '../icons/HelpIcon';
import KeyIcon from '../icons/KeyIcon';
import NoteIcon from '../icons/NoteIcon';
import ParagraphIcon from '../icons/ParagraphIcon';
import TriangleIcon from '../icons/TriangleIcon';
import ThemeContext from '../theme/ThemeContext';
import PdfJs from '../vendors/PdfJs';
import Annotation from './Annotation';
import AnnotationType from './AnnotationType';
import Popup from './Popup';

interface TextProps {
    annotation: PdfJs.Annotation;
    childAnnotation?: PdfJs.Annotation;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
}

const Text: React.FC<TextProps> = ({ annotation, childAnnotation, page, viewport }) => {
    const theme = useContext(ThemeContext);
    const hasPopup = annotation.hasPopup === false;
    const isRenderable = !!(annotation.hasPopup || annotation.title || annotation.contents);
    const name = annotation.name ? annotation.name.toLowerCase() : '';

    return (
        <Annotation annotation={annotation} hasPopup={hasPopup} ignoreBorder={false} isRenderable={isRenderable} page={page} viewport={viewport}>
            {(props): React.ReactElement => (
                <>
                <div
                    {...props.slot.attrs}
                    className={`${theme.prefixClass}-annotation ${theme.prefixClass}-annotation-text`}
                    data-annotation-id={annotation.id}
                    onClick={props.popup.toggleOnClick}
                    onMouseEnter={props.popup.openOnHover}
                    onMouseLeave={props.popup.closeOnHover}
                >
                    {name && (
                        <div className={`${theme.prefixClass}-annotation-text-icon`}>
                            {name === 'check' && <CheckIcon />}
                            {name === 'comment' && <CommentIcon />}
                            {name === 'help' && <HelpIcon />}
                            {name === 'insert' && <TriangleIcon />}
                            {name === 'key' && <KeyIcon />}
                            {name === 'note' && <NoteIcon />}
                            {(name === 'newparagraph' || name === 'paragraph') && <ParagraphIcon />}
                        </div>
                    )}
                    {props.slot.children}
                </div>
                {childAnnotation && childAnnotation.annotationType === AnnotationType.Popup && props.popup.opened && (
                    <Popup
                        annotation={childAnnotation}
                        page={page}
                        viewport={viewport}
                    />
                )}
                </>
            )}
        </Annotation>
    );
};

export default Text;
