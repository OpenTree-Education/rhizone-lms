import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import { PostTemplate } from './Post';

export default {
  title: 'Post',
  component: PostTemplate,
} as ComponentMeta<typeof PostTemplate>;

const Template: ComponentStory<typeof PostTemplate> = args => (
  <PostTemplate {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  author: 'Author Name',
  publicationDate: '2021-12-14',
  slug: 'title-subtitle',
  subtitle: 'Subtitle',
  title: 'Title',
  html: '<p>Text of the post.</p>',
};
