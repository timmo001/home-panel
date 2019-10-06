// @flow
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import emoji from 'markdown-it-emoji';
import externalLinks from 'markdown-it-external-links';
import markdownIt from 'markdown-it';
import ReactHtmlParser from 'react-html-parser';

interface MarkdownTextProps {
  text: string;
}

function MarkdownText(props: MarkdownTextProps) {
  const [text, setText] = useState();

  useEffect(() => {
    setText(
      ReactHtmlParser(
        !props.text
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
              .render(props.text)
      )
    );
  }, [props.text]);

  return <span>{text}</span>;
}

MarkdownText.propTypes = {
  text: PropTypes.string
};

export default MarkdownText;
