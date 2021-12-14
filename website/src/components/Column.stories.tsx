import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import Column from './Column';
import Section from './Section';

export default {
  title: 'Column',
  component: Column,
} as ComponentMeta<typeof Column>;

const Template: ComponentStory<typeof Column> = args => (
  <Section columns={[args]} />
);

export const Basic = Template.bind({});
Basic.args = {
  heading: 'Column',
  body: 'This is the body text of the column. When no span is given, it takes up all 12 grid columns.',
};
