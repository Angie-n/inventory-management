const toInputFormat = (date) => {
    if(date == null) return '';
    
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    if (month < 10) month = "0" + month;
    let day = date.getUTCDate() + 1;
    if (day < 10) day = "0" + day;

    return year + '-' + month + '-' + day;
}

module.exports = {toInputFormat};