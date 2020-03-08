import React, { useEffect, useState, ReactElement } from 'react';
import emoji from 'markdown-it-emoji';
import externalLinks from 'markdown-it-external-links';
import markdownIt from 'markdown-it';
import ReactHtmlParser from 'react-html-parser';

interface MarkdownTextProps {
  text: string;
}

function MarkdownText(props: MarkdownTextProps): ReactElement {
  const [text, setText] = useState<ReactElement[]>();

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

export default MarkdownText;
