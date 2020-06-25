const { validateEmail } = require('./regexValidation');

const getEmailMentions = (notification) => {
  const allWordsArray = notification.split(' ');
  const mentionsArray = allWordsArray.filter((w) => w[0] === '@').map((m) => m.slice(1));
  const emailMentionsArray = mentionsArray.filter((m) => validateEmail(m));
  return emailMentionsArray;
};

module.exports = {
  getEmailMentions,
};
