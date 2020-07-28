/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import InfoIcon from './InfoIcon';
import propertiesPlugin, { ShowPropertiesMenuItemProps as ShowPropertiesMenuItemPropsType } from './propertiesPlugin';

export default propertiesPlugin;
export { InfoIcon };

// Types
import { ShowPropertiesProps as ShowPropertiesPropsType } from './ShowProperties';

export type ShowPropertiesProps = ShowPropertiesPropsType;
export type ShowPropertiesMenuItemProps = ShowPropertiesMenuItemPropsType;
