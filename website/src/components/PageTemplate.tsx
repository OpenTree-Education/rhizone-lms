import { PageData } from '../types/content';
import React from 'react';
import Page from './Page';

interface PageTemplateProps {
  pageContext: PageData;
}

const PageTemplate = ({ pageContext }: PageTemplateProps) => (
  <Page {...pageContext} />
);

export default PageTemplate;
