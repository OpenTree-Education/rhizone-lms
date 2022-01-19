import { DependencyList, useEffect, useState } from 'react';

import { APIError } from '../types/api';

interface UseAPIDataArgs<ResponseDataType> {
  initialData?: ResponseDataType | null;
  deps?: DependencyList;
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
  deps = [],
  initialData = null,
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
      const controller = new AbortController();
      const { signal } = controller;
      fetch(`${process.env.REACT_APP_API_ORIGIN}${path}`, {
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
    [path, sendCredentials, ...deps]
  );
  return { data, error, isLoading };
};

export default useApiData;
