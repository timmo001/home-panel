import React, { useEffect, useState, ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownTextProps {
  text: string;
}

function MarkdownText(props: MarkdownTextProps): ReactElement {
  const [text, setText] = useState<ReactElement[]>();

  useEffect(() => {
    setText(props.text || '');
  }, [props.text]);

  return <ReactMarkdown source={text} escapeHtml={true} />;
}

export default MarkdownText;
