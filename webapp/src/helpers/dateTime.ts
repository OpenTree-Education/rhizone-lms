export const formatDateTime = (date: string) => {
  const dateObj = new Date(date);

  return new Intl.DateTimeFormat([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(dateObj);
};
