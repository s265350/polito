import dayjs from 'dayjs';

function getTasks (tasks, filter) {
    switch(filter){
        case('All'):
            return tasks;
        case('Important'):
            return tasks.filter(task => task.important === 'true' || task.important === true);
        case('Private'):
            return tasks.filter(task => task.private === 'true' || task.private === true);
        case("Today's"):
            return tasks.filter(task => task.deadline && isToday(task.deadline));
        case("Next week's"):
            return tasks.filter(task => task.deadline && isNextWeek(task.deadline));
        default: // search filter
            return tasks.filter(task => task.description.includes(filter));
    }
}

/* 
 * Function to check if a date is today. Returns true if the date is today, false otherwise.
 * @param {*} date the javascript Date to be checked
 */
 function isToday(date){
    const comparisonTemplate = 'YYYY-MM-DD';
    const now = dayjs();
    return dayjs(date) && (dayjs(date).format(comparisonTemplate) === now.format(comparisonTemplate)) 
}

/*
 * Function to check if a date is in the next week. Returns true if the date is in the next week, false otherwise.
 * @param {*} date the javascript Date to be checked
*/
function isNextWeek(date){
    const tomorrow = dayjs().add(1, 'day');
    const nextWeek = dayjs().add(7, 'day');
    const ret = dayjs(date) && ( !dayjs(date).isBefore(tomorrow,'day') && !dayjs(date).isAfter(nextWeek,'day') );
    //console.dir(dayjs(date));
    return ret;
}

/*
 * Function to check if a date is yesterday. Returns true if the date is yesterday, false otherwise.
 * @param {*} date the javascript Date to be checked
 
function isYesterday(date){
    const comparisonTemplate = 'YYYY-MM-DD';
    const yesterday = DayJS().subtract(1, 'day');
    return date && (date.format(comparisonTemplate) === yesterday.format(comparisonTemplate));
}*/

/*
 * Function to check if a date is tomorrow. Returns true if the date is tomorrow, false otherwise.
 * @param {*} date the javascript Date to be checked
 
 function isTomorrow(date){
    const comparisonTemplate = 'YYYY-MM-DD';
    const tomorrow = DayJS().add(1, 'day');
    return date && (date.format(comparisonTemplate) === tomorrow.format(comparisonTemplate));
}*/

 export default getTasks;