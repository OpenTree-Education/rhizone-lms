import { DependencyList, useEffect, useState } from 'react';

import { APIError } from '../types/api';

interface UseAPIDataArgs<ResponseDataType> {
  body?: unknown;
  initialData?: ResponseDataType | null;
  deps?: DependencyList;
  method?: string;
  path: string;
  sendCredentials?: boolean;
  shouldFetch?: () => boolean;
}

interface UseAPIDataState<ResponseDataType> {
  data: ResponseDataType | null;
  error: APIError | Error | null;
  isLoading: boolean;
}

const useApiData = <ResponseDataType>({
  body = null,
  deps = [],
  initialData = null,
  method = 'GET',
  path,
  sendCredentials = false,
  shouldFetch,
}: UseAPIDataArgs<ResponseDataType>): UseAPIDataState<ResponseDataType> => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(initialData);
  useEffect(
    () => {
      if (shouldFetch && !shouldFetch()) {
        return;
      }
      setIsLoading(true);
      const serializedBody =
        body !== null &&
        typeof body !== 'undefined' &&
        ['POST', 'PUT'].includes(method)
          ? JSON.stringify(body)
          : null;
      const controller = new AbortController();
      const { signal } = controller;
      fetch(`${process.env.REACT_APP_API_ORIGIN}${path}`, {
        credentials: sendCredentials ? 'include' : 'omit',
        method,
        signal,
        headers: { 'Content-Type': 'application/json' },
        body: serializedBody,
      })
        .then(res => res.json())
        .then(
          ({ data }) => {
            setIsLoading(false);
            setData(data);
          },
          error => {
            setIsLoading(false);
            if (error.name === 'AbortError') {
              return;
            }
            setError(error);
          }
        );
      return () => controller.abort();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path, sendCredentials, ...deps]
  );
  return { data, error, isLoading };
};

export default useApiData;
