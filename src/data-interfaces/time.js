const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export function GetUnixTime() {
  return Math.floor(new Date().getTime() / 1000);
}

export function UnixTimeToMessageTime(unixTime) {
  let datetime = new Date(unixTime * 1000);
  let now = new Date();
  if (now.getFullYear() - datetime.getFullYear() > 0) {
    return (
      datetime.getFullYear() +
      ' ' +
      months[datetime.getMonth()] +
      ' ' +
      datetime.getDate()
    );
  }
  if (
    now.getMonth() - datetime.getMonth() > 0 ||
    now.getDate() - datetime.getDate() > 0
  ) {
    return months[datetime.getMonth()] + ' ' + datetime.getDate();
  } else return datetime.getHours() + ':' + String(datetime.getMinutes()).padStart(2, '0');
}
