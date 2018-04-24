
const moment = require('moment');

// timestamps are based on Jan 1, 1970 00:00:00am (unix epic)
// in JS timestamps are counted in milliseconds after this moment... and this sucks

//moment seems to be pretty handy with this
let date = moment();
date.add(100, 'year').subtract(3, 'month');
console.log(date.format('MMM Do, YYYY'));

date = moment();
console.log(date.format('h:mm a'));


date = moment(0);
console.log(date.format());


//current timestamp in milliseconds from unix epic:
let curTimestamp = moment().valueOf();
console.log(curTimestamp);