import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import Section from './Section';

export default {
  title: 'Section',
  component: Section,
} as ComponentMeta<typeof Section>;

const Template: ComponentStory<typeof Section> = args => <Section {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  columns: [
    {
      heading: 'Section',
      body: 'This is a column within the section.',
    },
  ],
};
