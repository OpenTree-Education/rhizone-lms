export const formatDateTime = (date: string, locale: any = null) => {
  const dateObj = new Date(date);
  const localeArr = []

  if (locale) {
    localeArr.push(locale);
  }

  return new Intl.DateTimeFormat(localeArr, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(dateObj);
};
