import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

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
      heading: 'Basic value prop',
      body: 'A column in its most basic form is a heading and a paragraph.',
      span: 6,
    },
  ],
};
