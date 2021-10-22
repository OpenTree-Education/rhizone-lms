export const collectionEnvelope = (data: object[], totalCount: number) => ({
  data,
  summary: {
    total_count: totalCount,
  },
});

export const itemEnvelope = (data: object) => ({ data });

export const errorEnvelope = (message: string) => ({ error: { message } });
