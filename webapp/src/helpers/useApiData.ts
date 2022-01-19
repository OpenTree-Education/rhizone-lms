import { DependencyList, useEffect, useState } from 'react';

import { APIError } from '../types/api';

const useApiData = <ResponseDataType>(
  resourcePath: string,
  sendCredentials: boolean = false,
  dependencies: DependencyList = [],
  defaultData: ResponseDataType | null = null,
  shouldFetch?: () => boolean
): {
  data: ResponseDataType | null;
  error: APIError | Error | null;
  isLoading: boolean;
} => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(defaultData);
  useEffect(
    () => {
      if (shouldFetch && !shouldFetch()) {
        return;
      }
      setIsLoading(true);
      const controller = new AbortController();
      const { signal } = controller;
      fetch(`${process.env.REACT_APP_API_ORIGIN}${resourcePath}`, {
        credentials: sendCredentials ? 'include' : 'omit',
        signal,
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
    [resourcePath, sendCredentials, ...dependencies]
  );
  return { data, error, isLoading };
};

export default useApiData;
