const toInputFormat = (date) => {
    if(date == null) return '';
    
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;
    let day = date.getDate();
    if (day < 10) day = "0" + day;

    return year + '-' + month + '-' + day;
}

module.exports = {toInputFormat};