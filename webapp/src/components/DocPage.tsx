import { Container, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { Doc, EntityId } from '../types/api';

interface DocsPageProps {
  docId: EntityId;
}

const DocPage = ({ docId }: DocsPageProps) => {
  const [error, setError] = useState(null);
  const [doc, setDoc] = useState<Doc | null>(null);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ORIGIN}/docs/${docId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(({ data, error }) => {
        if (error) {
          setError(error);
        }
        if (data) {
          setDoc(data);
        }
      })
      .catch(error => {
        setError(error);
      });
  }, [docId]);
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
