/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import Button from './components/Button';
import Menu from './components/Menu';
import MenuDivider from './components/MenuDivider';
import MenuItem from './components/MenuItem';
import PrimaryButton from './components/PrimaryButton';
import ProgressBar from './components/ProgressBar';
import Separator from './components/Separator';
import Spinner from './components/Spinner';
import Icon from './icons/Icon';
import defaultLayout from './layouts/defaultLayout';
import defaultToolbar from './layouts/defaultToolbar';
import LocalizationContext from './localization/LocalizationContext';
import LocalizationProvider from './localization/LocalizationProvider';
import Modal from './portal/Modal';
import Popover from './portal/Popover';
import Position from './portal/Position';
import Tooltip from './portal/Tooltip';
import ScrollMode from './ScrollMode';
import SelectionMode from './SelectionMode';
import SpecialZoomLevel from './SpecialZoomLevel';
import createStore, { Store as StoreType, StoreHandler as StoreHandlerType } from './store/createStore';
import Viewer from './Viewer';
import Worker from './Worker';

export default Viewer;
export {
    Button,
    createStore,
    defaultLayout,
    defaultToolbar,
    Icon,
    LocalizationContext,
    LocalizationProvider,
    Menu,
    MenuDivider,
    MenuItem,
    Modal,
    Popover,
    Position,
    PrimaryButton,
    ProgressBar,
    ScrollMode,
    SelectionMode,
    Separator,
    SpecialZoomLevel,
    Spinner,
    Tooltip,
    Worker,
};

// -----
// PdfJs
// -----

export declare namespace PdfJs {
    type FileData = string | Uint8Array;

    interface PdfDocument {
        numPages: number;
        getPage(pageIndex: number): Promise<Page>;
    }

    // View port
    interface ViewPortParams {
        rotation?: number;
        scale: number;
    }
    interface ViewPortCloneParams {
        dontFlip: boolean;
    }
    interface ViewPort {
        height: number;
        rotation: number;
        transform: number[];
        width: number;
        clone(params: ViewPortCloneParams): ViewPort;
    }

    // Render task
    interface PageRenderTask {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        promise: Promise<any>;
        cancel(): void;
    }

    // Render page
    interface PageRenderParams {
        canvasContext: CanvasRenderingContext2D;
        // Should be 'print' when printing
        intent?: string;
        transform?: number[];
        viewport: ViewPort;
    }
    interface Page {
        getViewport(params: ViewPortParams): ViewPort;
        render(params: PageRenderParams): PageRenderTask;
    }
}

// -----
// Types
// -----

import { Toggle as ToggleType } from './hooks/useToggle';
import { Slot as SlotType } from './layouts/Slot';
import { default as OpenFileType } from './OpenFile';
import { default as LocalizationMapType } from './localization/LocalizationMap';
import { Plugin as PluginType, PluginOnDocumentLoad as PluginOnDocumentLoadType } from './types/Plugin';
import { PluginFunctions as PluginFunctionsType } from './types/PluginFunctions';
import { default as RenderViewerPropsType } from './types/RenderViewer';
import { ViewerState as ViewerStateType } from './types/ViewerState';

export type LocalizationMap = LocalizationMapType;
export type OpenFile = OpenFileType;
export type Toggle = ToggleType;
export type Slot = SlotType;
export type Store<T> = StoreType<T>;
export type StoreHandler<T> = StoreHandlerType<T>;
export type Plugin = PluginType;
export type PluginFunctions = PluginFunctionsType;
export type PluginOnDocumentLoad = PluginOnDocumentLoadType;
export type RenderViewerProps = RenderViewerPropsType;
export type ViewerState = ViewerStateType;
