import { renderSanitizedMarkdown } from '../components/Markdown.jsx';

it('renders paragraphs', () => {
  expect(renderSanitizedMarkdown('asdf\n\nqwerty')).toBe('<p>asdf</p>\n<p>qwerty</p>');
});

it('supports github flavored markdown', () => {
  expect(renderSanitizedMarkdown("```\nprint('Hello, world!')\n```"))
    .toBe("<pre><code>print('Hello, world!')</code></pre>");
});

it('sanitizes html', () => {
  expect(renderSanitizedMarkdown('<img src=x onerror=alert(1)//>'))
    .toBe('<p><img src="x"></p>');
  expect(renderSanitizedMarkdown('<svg><g/onload=alert(2)//<p>'))
    .toBe('<p><svg><g></g></svg></p>');
  expect(renderSanitizedMarkdown('abc<iframe//src=jAva&Tab;script:alert(3)>def'))
    .toBe('<p>abc</p>');
});
