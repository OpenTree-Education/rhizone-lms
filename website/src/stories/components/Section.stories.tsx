import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import SectionComponent from '../../components/Section';

export default {
  title: 'Components/Section',
  component: SectionComponent,
} as ComponentMeta<typeof SectionComponent>;

const Template: ComponentStory<typeof SectionComponent> = args => (
  <SectionComponent {...args} />
);

export const Section = Template.bind({});
Section.args = {
  columns: [
    {
      heading: 'Section',
      body: 'This is a column within the section.',
    },
  ],
};
