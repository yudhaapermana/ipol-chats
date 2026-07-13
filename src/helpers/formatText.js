import React from 'react';

// const WA_REGEX = /(_\*[^\*\n]+\*_)|(\*_[^_\n]+_\*)|(\*[^\*\n]+\*)|(_[^_\n]+_)|(~[^~\n]+~)|(```[^`]+```)|(`[^`\n]+`)|(<br\s*\/?>)|(https?:\/\/[^\s<]+)/gi;

// export function formatText(text = '', componentDecorator) {
//     if (!text) return null;

//     const WA_REGEX = /(?<![\w])_\*([^\*\n]+)\*_(?![\w])|(?<![\w])\*_([^_\n]+)_\*(?![\w])|(?<![\w])\*([^\*\n]+)\*(?![\w])|(?<![\w])_([^_\n]+)_(?![\w])|(?<![\w])~([^~\n]+)~(?![\w])|```([^`]+)```|(?<![\w])`([^`\n]+)`(?![\w])|(<br\s*\/?>)|(https?:\/\/[^\s<]+)/gi;

//     const parts = [];
//     let lastIndex = 0;
//     let match;
//     let key = 0;

//     while ((match = WA_REGEX.exec(text)) !== null) {
//         const [full, boldItalic1, boldItalic2, bold, italic, strike, codeBlock, inlineCode, br, url] = match;

//         if (match.index > lastIndex) {
//             parts.push(text.slice(lastIndex, match.index));
//         }

//         if (boldItalic1 !== undefined) {
//             parts.push(<strong key={key++}><em>{boldItalic1}</em></strong>);
//         } else if (boldItalic2 !== undefined) {
//             parts.push(<strong key={key++}><em>{boldItalic2}</em></strong>);
//         } else if (bold !== undefined) {
//             parts.push(<strong key={key++}>{bold}</strong>);
//         } else if (italic !== undefined) {
//             parts.push(<em key={key++}>{italic}</em>);
//         } else if (strike !== undefined) {
//             parts.push(<del key={key++}>{strike}</del>);
//         } else if (codeBlock !== undefined) {
//             parts.push(
//                 <code key={key++} className="text-dark">
//                     {codeBlock}
//                 </code>
//             );
//         } else if (inlineCode !== undefined) {
//             parts.push(
//                 <code key={key++} className="text-dark">
//                     {inlineCode}
//                 </code>
//             );
//         } else if (br !== undefined) {
//             parts.push(<br key={key++} />);
//         } else if (url !== undefined) {
//             parts.push(
//                 componentDecorator
//                     ? componentDecorator(url, url, key++)
//                     : <a key={key++} href={url} target="_blank" rel="noreferrer">{url}</a>
//             );
//         }

//         lastIndex = match.index + full.length;
//     }

//     if (lastIndex < text.length) {
//         parts.push(text.slice(lastIndex));
//     }

//     return parts;
// }

export function formatText(text = '', componentDecorator) {
  if (!text) return null;

  const WA_REGEX = /(\*\*[^\*\n]+\*\*)|(\*[^\*\n]+\*)|(_[^_\n]+_)|(~[^~\n]+~)|(```[^`]+```)|(`[^`\n]+`)|(<br\s*\/?>)|(https?:\/\/[^\s<]+)/gi;

  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = WA_REGEX.exec(text)) !== null) {
    const [full] = match;

    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (full.startsWith('***') || full.startsWith('_*') || full.startsWith('*_')) {
      const inner = full.slice(2, -2);
      parts.push(
        <strong key={key++}>
          <em>{inner}</em>
        </strong>
      );
    } else if (full.startsWith('*')) {
      const inner = full.slice(1, -1);
      parts.push(<strong key={key++}>{inner}</strong>);
    } else if (full.startsWith('_')) {
      const inner = full.slice(1, -1);
      parts.push(<em key={key++}>{inner}</em>);
    } else if (full.startsWith('~')) {
      const inner = full.slice(1, -1);
      parts.push(<del key={key++}>{inner}</del>);
    } else if (full.startsWith('```')) {
      const inner = full.slice(3, -3);
      parts.push(
        <code key={key++} className="text-dark">
          {inner}
        </code>
      );
    } else if (full.startsWith('`')) {
      const inner = full.slice(1, -1);
      parts.push(
        <code key={key++} className="text-dark">
          {inner}
        </code>
      );
    } else if (full.match(/<br\s*\/?>/i)) {
      parts.push(<br key={key++} />);
    } else if (full.startsWith('http')) {
      parts.push(
        componentDecorator ? (
          componentDecorator(full, full, key++)
        ) : (
          <a key={key++} href={full} target="_blank" rel="noreferrer">
            {full}
          </a>
        )
      );
    }

    lastIndex = match.index + full.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
