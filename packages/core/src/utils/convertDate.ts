/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2023 Nguyen Huu Phuoc <me@phuoc.ng>
 */

const dateRegex = new RegExp(
    '^D:' + // Prefix
        '(\\d{4})' + // group 1: Year
        '(\\d{2})?' + // group 2: Month
        '(\\d{2})?' + // group 3: Day
        '(\\d{2})?' + // group 4: Hour
        '(\\d{2})?' + // group 5: Minute
        '(\\d{2})?' + // group 6: Second
        '([Z|+|-])?' + // group 7: Universal time relation
        '(\\d{2})?' + // group 8: Offset hour
        "'?" +
        '(\\d{2})?' + // group 9: Offset minute
        "'?"
);

const parse = (value: string, min: number, max: number, defaultValue: number): number => {
    const parsed = parseInt(value, 10);
    return parsed >= min && parsed <= max ? parsed : defaultValue;
};

export const convertDate = (input: string): Date | null => {
    const matches = dateRegex.exec(input);
    if (!matches) {
        return null;
    }

    const year = parseInt(matches[1], 10);
    const month = parse(matches[2], 1, 12, 1) - 1;
    const day = parse(matches[3], 1, 31, 1);
    let hour = parse(matches[4], 0, 23, 0);
    let minute = parse(matches[5], 0, 59, 0);
    const second = parse(matches[6], 0, 59, 0);

    const universalTimeRelation = matches[7] || 'Z';
    const offsetHour = parse(matches[8], 0, 23, 0);
    const offsetMinute = parse(matches[9], 0, 59, 0);

    switch (universalTimeRelation) {
        case '-':
            hour += offsetHour;
            minute += offsetMinute;
            break;
        case '+':
            hour -= offsetHour;
            minute -= offsetMinute;
            break;
        default:
            break;
    }

    return new Date(Date.UTC(year, month, day, hour, minute, second));
};
