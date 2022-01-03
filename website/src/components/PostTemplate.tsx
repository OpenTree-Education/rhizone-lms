import { PostData } from '../types/content';
import React from 'react';
import Post from './Post';

declare interface PostTemplateProps {
  pageContext: PostData;
}

const PostTemplate = ({ pageContext }: PostTemplateProps) => (
  <Post {...pageContext} />
);

export default PostTemplate;
