import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import ColumnComponent from '../../components/Column';
import Section from '../../components/Section';

export default {
  title: 'Components/Column',
  component: ColumnComponent,
} as ComponentMeta<typeof ColumnComponent>;

const Template: ComponentStory<typeof ColumnComponent> = args => (
  <Section columns={[args]} />
);

export const Column = Template.bind({});
Column.args = {
  heading: 'Column',
  body: 'This is the body text of the column. When no span is given, it takes up all 12 grid columns.',
};
