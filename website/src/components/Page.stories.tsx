import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import { PageTemplate } from './Page';

export default {
  title: 'Page',
  component: PageTemplate,
} as ComponentMeta<typeof PageTemplate>;

const Template: ComponentStory<typeof PageTemplate> = args => (
  <PageTemplate {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  title: 'Title',
  sections: [
    {
      columns: [
        {
          heading: 'Page',
          body: 'This is a basic page with a header and footer.',
        },
      ],
    },
  ],
};
