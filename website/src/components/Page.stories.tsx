import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import Page from './Page';

export default {
  title: 'Components/Page',
  component: Page,
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = args => <Page {...args} />;

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
