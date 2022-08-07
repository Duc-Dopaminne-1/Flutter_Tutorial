import moment from 'moment';

export function formatTime(date: string): string {
  const dateFormat = moment(date).format('hh:mm a');
  return dateFormat == 'Invalid date' ? '' : dateFormat;
}

export function formatDate(date: string): string {
  const dateFormat = moment(date).format('MMMM DD, YYYY');
  return dateFormat == 'Invalid date' ? '' : dateFormat;
}

function formatTwoDigits(n: number) {
  return n < 10 ? '0' + n : n;
}

export function formatTimePlayer(seconds: number) {
  const ss = Math.floor(seconds) % 60;
  const mm = Math.floor(seconds / 60) % 60;
  const hh = Math.floor(seconds / 3600);

  if (hh > 0) {
    return hh + ':' + formatTwoDigits(mm) + ':' + formatTwoDigits(ss);
  } else {
    return mm + ':' + formatTwoDigits(ss);
  }
}

export function formatDuration(seconds: number) {
  const ss = Math.floor(seconds) % 60;
  const mm = Math.floor(seconds / 60) % 60;
  const hh = Math.floor(seconds / 3600);

  if (hh > 0) {
    return hh + ':' + formatTwoDigits(mm) + ':' + formatTwoDigits(ss) + 'h';
  } else if (mm > 0) {
    return mm + ':' + formatTwoDigits(ss) + 'm';
  } else {
    return ss + 's';
  }
}

export function formatDurationRecord(ms: number) {
  const ss = Math.floor(ms / 1000) % 60;
  const mm = Math.floor(ms / 1000 / 60) % 60;

  if (mm > 0) {
    return mm + ':' + formatTwoDigits(ss);
  } else if (ss >= 0) {
    return '00:' + formatTwoDigits(ss);
  }
}

export function formatBlogDuration(minutes: number) {
  const mm = Math.floor(minutes) % 60;
  const hh = Math.floor(minutes / 60);

  if (hh > 0) {
    return hh + (hh > 1 ? ' hours ' : ' hour ') + (mm > 0 ? formatTwoDigits(mm) + (mm > 1 ? ' mins' : ' min') : '');
  } else {
    return mm + (mm > 1 ? ' mins' : ' min');
  }
}
