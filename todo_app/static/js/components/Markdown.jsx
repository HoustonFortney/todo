import showdown from 'showdown';
import DOMPurify from 'dompurify';

function sanitize(dirty) {
  return DOMPurify.sanitize(dirty);
}

export function renderSanitizedMarkdown(md) {
  const converter = new showdown.Converter();
  converter.setFlavor('github');
  const dirty_html = converter.makeHtml(md);
  return sanitize(dirty_html);
}
