type GreetingType = {
  greeting: string;
  delimiter: string;
  beginning_punct: string;
  ending_punct: string;
  ltr: 'ltr' | 'rtl';
};

let morning_greetings = new Map<string, GreetingType>();
morning_greetings.set('en', {
  beginning_punct: '',
  greeting: 'Good morning',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr'
});
morning_greetings.set('fr', {
  beginning_punct: '',
  greeting: 'Bon matin',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr'
});
morning_greetings.set('ja', {
  beginning_punct: '',
  greeting: 'おはようございます',
  delimiter: '、',
  ending_punct: '!',
  ltr: 'ltr'
});
morning_greetings.set('es', {
  beginning_punct: '¡',
  greeting: 'Buenos días',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr'
});
morning_greetings.set('fa', {
  beginning_punct: '',
  greeting: 'صبح بخیر',
  delimiter: ' ',
  ending_punct: '',
  ltr: 'rtl'
});
morning_greetings.set('fi', {
  beginning_punct: '',
  greeting: 'Hyvää huomenta',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr'
});
morning_greetings.set('ru', {
  beginning_punct: '',
  greeting: 'Доброе утро',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr'
});

let afternoon_greetings = new Map<string, GreetingType>();
afternoon_greetings.set('en', {
  beginning_punct: '',
  greeting: 'Good afternoon',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr',
});
afternoon_greetings.set('fr', {
  beginning_punct: '',
  greeting: 'Bonne après-midi',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr',
});
afternoon_greetings.set('ja', {
  beginning_punct: '',
  greeting: 'こんにちは',
  delimiter: '、',
  ending_punct: '!',
  ltr: 'ltr',
});
afternoon_greetings.set('es', {
  beginning_punct: '¡',
  greeting: 'Buenas tardes',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr'
});
afternoon_greetings.set('fa', {
  beginning_punct: '',
  greeting: 'عصر بخیر',
  delimiter: ' ',
  ending_punct: '',
  ltr: 'rtl'
});
afternoon_greetings.set('fi', {
  beginning_punct: '',
  greeting: 'Hyvää iltapäivää',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr'
});
afternoon_greetings.set('ru', {
  beginning_punct: '',
  greeting: 'Добрый день',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr'
});

let evening_greetings = new Map<string, GreetingType>();
evening_greetings.set('en', {
  beginning_punct: '',
  greeting: 'Good evening',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr',
});
evening_greetings.set('fr', {
  beginning_punct: '',
  greeting: 'Bonsoir',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr',
});
evening_greetings.set('ja', {
  beginning_punct: '',
  greeting: 'こんばんは',
  delimiter: '、',
  ending_punct: '!',
  ltr: 'ltr',
});
evening_greetings.set('es', {
  beginning_punct: '¡',
  greeting: 'Buenas noches',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr'
});
evening_greetings.set('fa', {
  beginning_punct: '',
  greeting: 'عصر بخیر',
  delimiter: ' ',
  ending_punct: '',
  ltr: 'rtl'
});
evening_greetings.set('fi', {
  beginning_punct: '',
  greeting: 'Hyvää iltaa',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr'
});
evening_greetings.set('ru', {
  beginning_punct: '',
  greeting: 'Добрый вечер',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr'
});

/**
 * Returns the greeting string based on the different time of the day in a preferred language.
 *
 * @param timeOfDay - "morning", "afternoon" or "evening" depending on the time of the day
 * @param preferredLanguage - the browser language two-character code
 * @param username - user's name
 * @returns The user_greeting_string which includes the structure of the greeting string (ex. "Good morning, {username}!")
 *
 */
const getPreferredLanguageGreeting = (
  timeOfDay: string,
  preferredLanguage: string,
  username?: string
): string => {
  let user_greeting: GreetingType | any = {};

  if (timeOfDay === 'morning') {
    user_greeting =
      morning_greetings.get(preferredLanguage) || morning_greetings.get('en')!;
  } else if (timeOfDay === 'afternoon') {
    user_greeting =
      afternoon_greetings.get(preferredLanguage) ||
      afternoon_greetings.get('en')!;
  } else if (timeOfDay === 'evening') {
    user_greeting =
      evening_greetings.get(preferredLanguage) || evening_greetings.get('en')!;
  }

  let user_greeting_string = "";

  if (username) {
    user_greeting_string += user_greeting.beginning_punct;
    user_greeting_string += user_greeting.greeting;
    user_greeting_string += user_greeting.delimiter;
    user_greeting_string += username;
    user_greeting_string += user_greeting.ending_punct;
  } else {
    user_greeting_string += user_greeting.beginning_punct;
    user_greeting_string += user_greeting.greeting;
    user_greeting_string += user_greeting.ending_punct;
  }

  return user_greeting_string;
};

/**
 * Gets hour based on Date() and returns the greeting string based on the different time of the day.
 *
 * @param username - user's name
 * @returns The string which includes the icon and the greeting string depending on the time of the day (ex. "🌅 Good morning, {username}!")
 *
 */
export const getGreeting = (username?: string): string => {
  const myDate = new Date();
  const hrs = myDate.getHours();

  let greet = '';
  // Getting first two characters of the browser language.
  const preferredLanguage = window.navigator.language.slice(0, 2);

  if (hrs >= 2 && hrs < 12)
    greet = `🌅 ${getPreferredLanguageGreeting(
      'morning',
      preferredLanguage,
      username
    )}`;
  else if (hrs >= 12 && hrs <= 17)
    greet = `🌞 ${getPreferredLanguageGreeting(
      'afternoon',
      preferredLanguage,
      username
    )}`;
  else if (hrs >= 17 || hrs === 1)
    greet = `🌇 ${getPreferredLanguageGreeting(
      'evening',
      preferredLanguage,
      username
    )}`;

  return greet;
};
