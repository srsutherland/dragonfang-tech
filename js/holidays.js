const _getNthWeekday = (year, month, weekday, n) => {
    let date = new Date(year, month, 1);
    let count = 0;
    while (date.getMonth() == month) {
        if (date.getDay() == weekday) {
            count++;
            if (count == n) {
                return date;
            }
        }
        date.setDate(date.getDate() + 1);
    }
    const weekday_name = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][weekday];
    const month_name = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long' });
    throw new Error(`No ${n}th ${weekday_name} in ${month_name} ${year}`);
}

class Holidays {
    constructor(year) {
        this.year = year;
        // Include all government holidays
        this.holidays = [
            this.new_years_day = {
                id: "new_years_day",
                name: "New Year's Day",
                date: [0, 1],
                day_off: true
            },
            this.martin_luther_king_day = {
                id: "mlk_day",
                name: "Martin Luther King Day",
                date: (year) => {
                    return _getNthWeekday(year, 1, 1, 2);
                },
                day_off: true
            },
            this.presidents_day = {
                id: "presidents_day",
                name: "Presidents Day",
                date: (year) => {
                    return _getNthWeekday(year, 2, 1, 3);
                },
                day_off: true
            },
            this.memorial_day = {
                id: "memorial_day",
                name: "Memorial Day",
                date: (year) => {
                    return new Date(year, 4, 31);
                },
                day_off: true
            },
            this.independence_day = {
                id: "independence_day",
                name: "Independence Day",
                altname: "4th of July",
                date: [6, 4],
                day_off: true
            },
            this.labor_day = {
                id: "labor_day",
                name: "Labor Day",
                date: (year) => {
                    return _getNthWeekday(year, 8, 1, 1);
                },
                day_off: true
            },
            this.columbus_day = {
                id: "columbus_day",
                name: "Indigenous Peoples Day",
                altname: "Columbus Day",
                date: (year) => {
                    return _getNthWeekday(year, 9, 1, 2);
                },
                day_off: true
            },
            this.veterans_day = {
                id: "veterans_day",
                name: "Veterans Day",
                date: [10, 11],
                day_off: true
            },
        ]
    }
}

// Base class for all holidays
class Holiday {
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
        this.altname = params.altname; // e.g. "Colombus Day"
        if (params.date instanceof Date) {
            this._calculateDate = (year) => {
                return this.date = new Date(year, params.date.getMonth(), params.date.getDate());
            }
        }   
        else if (params.date instanceof Array && params.date.length == 2) {
            this._calculateDate = (year) => {
                return this.date = new Date(this.year, params.date[0], params.date[1]);
            }
        } else if (params.date instanceof Function) {
            this._calculateDate = params.date;
        } else {
            throw new Error("Invalid date format");
        }
    }

    date(year) {
        return this._calculateDate(year);
    }
}