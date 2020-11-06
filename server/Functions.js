function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function field_period_to_text(field_period) {
<<<<<<< HEAD
    let month_number = field_period.substr(5, 2);
    let month = "Unknown";

    switch (month_number) {
    case "01":
        month = "January";
        break;
    case "02":
        month = "February";
        break;
    case "03":
        month = "March";
        break;
    case "04":
        month = "April";
        break;
    case "05":
        month = "May";
        break;
    case "06":
        month = "June";
        break;
    case "07":
        month = "July";
        break;
    case "08":
        month = "August";
        break;
    case "09":
        month = "September";
        break;
    case "10":
        month = "October";
        break;
    case "11":
        month = "November";
        break;
    case "12":
        month = "December";
        break;
    }

    let year_number = field_period.substr(3, 2);
    let year = "";

    switch (year_number) {
    case "19":
        year = "2019";
        break;
    case "20":
        year = "2020";
        break;
    case "21":
        year = "2021";
        break;
    case "22":
        year = "2022";
        break;
    }
    return month + " " + year;
=======
    let month_number_str = field_period.substr(5, 2);
    let month_number_int = -1;
    let month = "Unknown";

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    if(isNumber(month_number_str)) {
        month_number_int = Integer.parseInt(month_number_str);
    }

    if(month_number_int > 0 && month_number_int < 13) {
        month = monthNames[month_number_int];
    }

    return month + " 20" + field_period.substr(3, 2);
>>>>>>> 82bfbdc... Clean up unwieldy date switch statement
}

module.exports = { field_period_to_text };
