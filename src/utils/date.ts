export const currentDate = (date_created_utc: string = '') => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  const dateTime = date_created_utc ? new Date(date_created_utc) : new Date();

  return Intl.DateTimeFormat('en-US', options).format(dateTime).toString();
};

export function formattedDate() {
  const currentDate = new Date();

  if (currentDate.getDate() !== new Date().getDate()) {
    currentDate.setDate(0);
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const formattedMonth = month < 10 ? '0' + month : month.toString();
  const formattedDay = day < 10 ? '0' + day : day.toString();

  return `${year}-${formattedMonth}-${formattedDay}`;
}

const isValidDate = (date: Date) => date instanceof Date && !isNaN(date.getTime());

export const dateTimeUTC = (date_utc: string, showTime: boolean = false) => {
  const optionsWithoutTime: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };

  const dateTime = new Date(date_utc);

  if (!isValidDate(dateTime)) {
    console.error('Invalid date value:', date_utc);
    return 'Invalid date';
  }

  const timeFormat = Intl.DateTimeFormat('en-US', options).format(dateTime).toString();
  const dateFormat = Intl.DateTimeFormat('en-US', optionsWithoutTime).format(dateTime).toString();

  return showTime ? `${dateFormat} ${timeFormat}` : dateFormat;
};

export const getMsgTime = (date_created_utc: string) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };

  if (!date_created_utc) {
    console.error('Invalid date string: ', date_created_utc);
    return new Date().getTime().toString();
  }

  const dateTime = new Date(date_created_utc);

  if (isNaN(dateTime.getTime())) {
    console.error('Invalid time value: ', date_created_utc);
    return new Date().getTime().toString();
  }

  return Intl.DateTimeFormat('en-US', options).format(dateTime).toString();
};

export const msgDate = (
  date_created_utc: string,
  { as, showTime }: { as?: string; showTime?: boolean }
) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  };

  const dateTime = new Date(date_created_utc);
  const day = dateTime.toLocaleDateString('en-US', { weekday: 'short' });
  const { time } = extractDateAndTimeFromTimeStamp(dateTime.getTime());
  const now = new Date();

  // Calculating the start and end of the current week.
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Catering for the display of today and yesterday.
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (
    dateTime.getTime() >= today.getTime() &&
    dateTime.getTime() < today.getTime() + 24 * 60 * 60 * 1000
  ) {
    if (as === 'last_seen') {
      return getMsgTime(date_created_utc);
    }
    return 'Today';
  } else if (dateTime.getTime() >= yesterday.getTime() && dateTime.getTime() < today.getTime()) {
    return showTime ? `yesterday ${time}` : 'yesterday';
  } else if (
    dateTime.getTime() >= startOfWeek.getTime() &&
    dateTime.getTime() <= endOfWeek.getTime()
  ) {
    return day;
  } else {
    return dateTime.toLocaleDateString('en-US', options);
  }
};

export const extractDateAndTimeFromTimeStamp = (timestamp: number) => {
  const dateTs = new Date(timestamp);
  const year = dateTs.getFullYear();
  const month = dateTs.getMonth() + 1;
  const day = dateTs.getDate();
  const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const time = Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(dateTs);

  return { date, time };
};

export const convertDateToTimestamp = (date: string) => {
  return new Date(date).getTime();
};

export const getCurrentDay = () => {
  const today = new Date();

  return today;
};

export const getNextDay = () => {
  const today = getCurrentDay();
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);

  return nextDay;
};

export const NotificationDate = (date_created_utc: string) => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };

  const dateTime = new Date(date_created_utc);
  const { time } = extractDateAndTimeFromTimeStamp(dateTime.getTime());
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (
    dateTime.getTime() >= today.getTime() &&
    dateTime.getTime() < today.getTime() + 24 * 60 * 60 * 1000
  ) {
    return time;
  } else {
    return dateTime.toLocaleDateString('en-US', options);
  }
};
