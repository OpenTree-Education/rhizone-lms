import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import yaml from 'js-yaml';

import ErrorBoundary from '../../components/ErrorBoundary';
import PageTemplateComponent from '../../components/PageTemplate';
import { PageData } from '../../types/content';

export default {
  title: 'Components/Page Template',
  component: PageTemplateComponent,
  argTypes: {
    pageContext: {
      name: 'Page Yaml',
      description:
        'Yaml content just like in the files in `src/content/pages`.',
      type: 'string',
    },
  },
} as ComponentMeta<typeof PageTemplateComponent>;

const Template: ComponentStory<any> = ({ pageContext }) => {
  let parsedPageContext: PageData;
  try {
    parsedPageContext = yaml.load(pageContext) as PageData;
  } catch (err) {
    return <h1>Failed to parse Yaml.</h1>;
  }
  return (
    <ErrorBoundary key={pageContext}>
      <PageTemplateComponent pageContext={parsedPageContext} />
    </ErrorBoundary>
  );
};

export const PageTemplate = Template.bind({});
PageTemplate.args = {
  pageContext: `title: PageTemplate
sections:
  - columns:
      - heading: PageTemplate
        body: |
          Paste some Yaml from <code>src/content/pages</code> to experiment with changes to a page.
`,
};
