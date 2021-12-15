import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import Post from './Post';

export default {
  title: 'Components/Post',
  component: Post,
} as ComponentMeta<typeof Post>;

const Template: ComponentStory<typeof Post> = args => <Post {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  author: 'Author Name',
  publicationDate: '2021-12-14',
  slug: 'title-subtitle',
  subtitle: 'Subtitle',
  title: 'Title',
  html: '<p>Text of the post.</p>',
};
