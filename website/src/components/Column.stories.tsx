import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Grid } from '@mui/material';
import React from 'react';

import Column from './Column';

export default {
  title: 'Column',
  component: Column,
} as ComponentMeta<typeof Column>;

const Template: ComponentStory<typeof Column> = args => (
  <Grid container>
    <Column {...args} />
  </Grid>
);

export const Basic = Template.bind({});
Basic.args = {
  heading: 'Column heading',
  body: 'This is the body text of the column. When no span is given, it takes up all 12 grid columns.',
};
