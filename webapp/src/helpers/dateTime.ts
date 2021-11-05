export const formatDateTime = (date: string, locale?: string) => {
  const dateObj = new Date(date);
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
