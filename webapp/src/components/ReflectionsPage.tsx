import { Box, Grid, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';

import CreateReflectionForm from './CreateReflectionForm';
import { EntityId, Reflection } from '../types/api';
import ReflectionCard from './ReflectionCard';

const ReflectionsPage = () => {
  const [error, setError] = useState(null);
  const [isLoadingReflections, setIsLoadingReflections] = useState(false);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [newlyCreatedReflectionIds, setNewlyCreatedReflectionIds] = useState<
    EntityId[]
  >([]);
  useEffect(() => {
    setIsLoadingReflections(true);
    fetch(`${process.env.REACT_APP_API_ORIGIN}/reflections`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(
        ({ data: reflections }) => {
          setReflections(reflections);
          setIsLoadingReflections(false);
        },
        error => {
          setError(error);
          setIsLoadingReflections(false);
        }
      );
  }, [newlyCreatedReflectionIds]);
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8}>
        <Box my={12}>
          <CreateReflectionForm
            onReflectionCreated={id =>
              setNewlyCreatedReflectionIds([...newlyCreatedReflectionIds, id])
            }
          />
        </Box>
        {reflections.length > 0 && <h2>Your previous entries</h2>}
        {error && (
          <div>There was an error fetching the list of past reflections.</div>
        )}
        {isLoadingReflections && <div>Loading...</div>}
        <Stack spacing={3}>
          {reflections.map(
            ({
              id,
              created_at: createdAt,
              journal_entries: journalEntries,
              responses,
            }) => (
              <ReflectionCard
                key={id}
                createdAt={createdAt}
                journalEntries={journalEntries}
                responses={responses}
              />
            )
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ReflectionsPage;
