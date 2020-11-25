import showdown from 'showdown';
import DOMPurify from 'dompurify';

function sanitize(dirty) {
  return DOMPurify.sanitize(dirty);
}

function renderSanitizedMarkdown(md) {
  const converter = new showdown.Converter();
  converter.setFlavor('github');
  const dirtyHtml = converter.makeHtml(md);
  return sanitize(dirtyHtml);
}

export default renderSanitizedMarkdown;
