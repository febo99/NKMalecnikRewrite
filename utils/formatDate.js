module.exports = {
/**
 * Formats SQL date to dd.mm.yyyy format
 * @param {Date} data
 */
  formatDate: (data) => {
    const date = new Date(data);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  },

  /**
 * Formats SQL date to yyyy-mm-dd format
 * @param {Date} data
 */
  htmlInputFormatDate: (data) => {
    const date = new Date(data);
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${date.getFullYear()}-${month}-${day}`;
  },
};
