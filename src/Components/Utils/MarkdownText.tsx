// @flow
import React from 'react';
import PropTypes from 'prop-types';
import emoji from 'markdown-it-emoji';
import externalLinks from 'markdown-it-external-links';
import markdownIt from 'markdown-it';
import ReactHtmlParser from 'react-html-parser';

interface MarkdownTextProps {
  text: string;
}

function MarkdownText(props: MarkdownTextProps) {
  const text = !props.text
    ? ''
    : new markdownIt({
        html: true,
        xhtmlOut: true,
        breaks: false,
        langPrefix: 'language-',
        linkify: true,
        typographer: true
      })
        .use(emoji)
        .use(externalLinks, { externalTarget: '_blank' })
        .render(props.text);

  return <span>{ReactHtmlParser(text)}</span>;
}

MarkdownText.propTypes = {
  text: PropTypes.string
};

export default MarkdownText;
