import { Container } from '@mui/material';
import React from 'react';

import { EntityId } from '../types/api';

declare interface DocsPageProps {
  docId: EntityId;
}

const DocPage = ({ docId }: DocsPageProps) => (
  <Container>
    <h1>Could not find doc with id &quot;{docId}&quot;.</h1>
  </Container>
);

export default DocPage;
