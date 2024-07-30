/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2024 Nguyen Huu Phuoc <me@phuoc.ng>
 */

'use client';

import * as React from 'react';
import { BookmarkItemSkeleton } from './BookmarkItemSkeleton';
import { DownArrowIcon } from './DownArrowIcon';
import { RightArrowIcon } from './RightArrowIcon';
import styles from './styles/bookmarkSkeleton.module.css';

export const BookmarkSkeleton = () => (
    <ul className={styles.list}>
        <li>
            <BookmarkItemSkeleton />
        </li>
        <li>
            <BookmarkItemSkeleton icon={<DownArrowIcon />} />
            <ul className={styles.list}>
                <li>
                    <BookmarkItemSkeleton depth={1} />
                </li>
                <li>
                    <BookmarkItemSkeleton depth={1} />
                </li>
                <li>
                    <BookmarkItemSkeleton depth={1} />
                </li>
            </ul>
        </li>
        <li>
            <BookmarkItemSkeleton icon={<RightArrowIcon />} />
        </li>
    </ul>
);
