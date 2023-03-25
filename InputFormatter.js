const dateCheck = new RegExp("([0-3][0-9])\.([0-1][0-9])\.[1-2][0-9][0-9][0-9]")

export default function inputFormatter(date, title, noteText) {
    const daySubStr = date.substr(0, 2)
    const yearSubStr = date.substr(6)
    const monthSubStr = date.substr(3, 2)
    if (date === "" || title === "" || noteText === "") {
        throw new Error("No empty fields.")
    } else if (noteText.length >= 800) {
        throw new Error("Note needs to be shorter than 800 characters.")
    } else if (yearSubStr < 1900 || yearSubStr > 2100) {
        throw new Error("Date year needs to be between years 1900 and 2100.")
    } else if (dateCheck.test(date) === false) {
        throw new Error("Date needs to be in dd.mm.yyyy format.")
    } else if (daySubStr > 31) {
        throw new Error("dd cannot be larger than 31.")
    } else if (monthSubStr > 12) {
        throw new Error("mm cannot be larger than 12.")
    } else if (daySubStr == '00') {
        throw new Error("Day number must be between 01-31")
    } else if (monthSubStr == '00') {
        throw new Error("Month number must be between 01-12")
    }
}