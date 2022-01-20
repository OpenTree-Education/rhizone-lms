import { Container, Typography } from '@mui/material';
import React from 'react';

import { Doc, EntityId } from '../types/api';
import useApiData from '../helpers/useApiData';

interface DocsPageProps {
  docId: EntityId;
}

const DocPage = ({ docId }: DocsPageProps) => {
  const { data: doc, error } = useApiData<Doc>({
    deps: [docId],
    path: `/docs/${docId}`,
  });
  if (error) {
    return (
      <Container>
        <h1>Could not find doc with id &quot;{docId}&quot;.</h1>
      </Container>
    );
  }
  if (!doc) {
    return null;
  }
  return (
    <Container>
      <h1>{doc.title}</h1>
      <Typography sx={{ whiteSpace: 'pre-wrap' }}>{doc.content}</Typography>
    </Container>
  );
};

export default DocPage;
