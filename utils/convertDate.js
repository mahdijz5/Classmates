const moment = require('jalali-moment');

exports.convertDate = (data) => {
    return moment(data).locale('fa').format('YYYY D MMM')
}