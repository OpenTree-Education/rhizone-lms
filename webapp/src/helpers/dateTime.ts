export const formatDateTime = (date: string, locale?: string) => {
  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) {
    return '';
  }
  let locales: [] | string = [];

  if (locale) {
    locales = locale;
  }

  return new Intl.DateTimeFormat(locales, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(dateObj);
};
