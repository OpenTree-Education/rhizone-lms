import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import PageComponent from '../../components/Page';

export default {
  title: 'Components/Page',
  component: PageComponent,
} as ComponentMeta<typeof PageComponent>;

const Template: ComponentStory<typeof PageComponent> = args => (
  <PageComponent {...args} />
);

export const Page = Template.bind({});
Page.args = {
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
