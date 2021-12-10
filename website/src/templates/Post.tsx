import React from 'react';

import Page from './Page';
import { PageData, PostData } from '../types/content';

const transformPostDataToPageData = ({
  frontmatter: { author, publicationDate, subtitle, title },
  html,
}: PostData): PageData => {
  const formattedTitle = `${title}${subtitle ? ': ' : ''}${subtitle}`;
  return {
    title: `${formattedTitle} | OpenTree Education Blog`,
    sections: [
      {
        columns: [
          {
            heading: title,
            headingComponent: 'h1',
            headingVariant: 'h1',
            body: subtitle,
            bodyVariant: 'h3',
            span: 6,
          },
        ],
      },
      {
        verticalWhiteSpace: 0,
        columns: [
          {
            body: `Published on ${publicationDate} by ${author}.`,
            bodyVariant: 'body2',
            span: 6,
          },
        ],
      },
      {
        verticalWhiteSpace: 6,
        columns: [
          {
            body: html,
            span: 6,
          },
        ],
      },
    ],
  };
};

declare interface PostProps {
  pageContext: PostData;
}

const Post = ({ pageContext }: PostProps) => (
  <Page {...{ pageContext: transformPostDataToPageData(pageContext) }} />
);

export default Post;
