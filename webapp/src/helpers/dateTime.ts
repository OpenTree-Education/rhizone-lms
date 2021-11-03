export const formatDateTime = (date: string, locale: any = null) => {
  const dateObj = new Date(date);
  let localeArr = [];

  if (locale) {
    localeArr = locale;
  }

  return new Intl.DateTimeFormat(localeArr, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(dateObj);
};
