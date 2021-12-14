import React from 'react';

import { PageTemplate } from './Page';
import { PageData, PostData } from '../types/content';

const transformPostDataToPageData = ({
  author,
  html,
  publicationDate,
  subtitle,
  title,
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
            bodyComponent: 'div',
            span: 6,
          },
        ],
      },
    ],
  };
};

export const PostTemplate = (props: PostData) => (
  <PageTemplate {...transformPostDataToPageData(props)} />
);

declare interface PostProps {
  pageContext: PostData;
}

const Post = ({ pageContext }: PostProps) => <PostTemplate {...pageContext} />;

export default Post;
