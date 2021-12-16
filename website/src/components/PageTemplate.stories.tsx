import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import yaml from 'js-yaml';

import ErrorBoundary from './ErrorBoundary';
import PageTemplate from './PageTemplate';
import { PageData } from '../types/content';

export default {
  title: 'Components/PageTemplate',
  component: PageTemplate,
  argTypes: {
    pageContext: {
      name: 'Page Yaml',
      description: 'Yaml content just like in the files in `src/content/pages`.',
      type: 'string',
    },
  },
} as ComponentMeta<typeof PageTemplate>;

const Template: ComponentStory<any> = ({ pageContext }) => {
  let parsedPageContext: PageData;
  try {
    parsedPageContext = yaml.load(pageContext) as PageData;
  } catch (err) {
    return <h1>Failed to parse Yaml.</h1>;
  }
  return (
    <ErrorBoundary key={pageContext}>
      <PageTemplate pageContext={parsedPageContext} />
    </ErrorBoundary>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  pageContext: `title: PageTemplate
sections:
  - columns:
      - heading: PageTemplate
        body: |
          Paste some Yaml from <code>src/content/pages</code> to experiment with changes to a page.
`,
};
