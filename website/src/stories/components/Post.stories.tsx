import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import PostComponent from '../../components/Post';

export default {
  title: 'Components/Post',
  component: PostComponent,
} as ComponentMeta<typeof PostComponent>;

const Template: ComponentStory<typeof PostComponent> = args => (
  <PostComponent {...args} />
);

export const Post = Template.bind({});
Post.args = {
  author: 'Author Name',
  publicationDate: '2021-12-14',
  slug: 'title-subtitle',
  subtitle: 'Subtitle',
  title: 'Title',
  html: '<p>Text of the post.</p>',
};
