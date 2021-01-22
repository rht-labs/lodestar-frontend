import { getFormattedDate, parseDatePickerDate } from "./patternfly_date_adapter"
import { isEqual } from 'date-fns'

describe('patternfly date adapter', () => {
    test('formats a date in YYYY-MM-DD', () => {
        const d = new Date(2020, 0, 1)
        const text = getFormattedDate(d)
        expect(text).toEqual("2020-01-01")
    })
    test('parses a date from YYYY-MM-DD', () => {
        const dateText = "2020-01-01"
        const date = parseDatePickerDate(dateText)
        expect(isEqual(date, new Date(Date.UTC(2020, 0, 1))))
    })
})