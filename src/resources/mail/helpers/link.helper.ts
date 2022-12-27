import Handlebars from 'handlebars';

export const link = (message: string, url: string) => {
  const sanitizedMessage = Handlebars.escapeExpression(message);
  const sanitizedUrl = Handlebars.escapeExpression(url);

  return new Handlebars.SafeString(`<a href="${sanitizedUrl}">${sanitizedMessage}</a>`);
};
