import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import PostTemplate from './PostTemplate';

export default {
  title: 'Components/PostTemplate',
  component: PostTemplate,
} as ComponentMeta<typeof PostTemplate>;

const Template: ComponentStory<typeof PostTemplate> = args => (
  <PostTemplate {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  pageContext: {
    author: 'Author Name',
    publicationDate: '2021-12-14',
    slug: 'title-subtitle',
    subtitle: 'Subtitle',
    title: 'Title',
    html: '<p>Text of the post.</p>',
  },
};
