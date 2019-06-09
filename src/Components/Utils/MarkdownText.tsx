// @flow
import React from 'react';
import PropTypes from 'prop-types';
import emoji from 'markdown-it-emoji';
import markdownIt from 'markdown-it';
import ReactHtmlParser from 'react-html-parser';

interface MarkdownTextProps {
  text: string;
}

function MarkdownText(props: MarkdownTextProps) {
  const text = new markdownIt({
    html: true,
    xhtmlOut: true,
    breaks: false,
    langPrefix: 'language-',
    linkify: true,
    typographer: true
  })
    .use(emoji)
    .render(props.text);

  return <span>{ReactHtmlParser(text)}</span>;
}

MarkdownText.propTypes = {
  text: PropTypes.string
};

export default MarkdownText;
