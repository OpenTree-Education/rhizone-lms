import { Request, Response } from 'express';

import { parsePaginationParams } from '../paginationParamsMiddleware';

describe('paginationParamsMiddleware', () => {
  describe('parsePaginationParams', () => {
    it('should set default limit and offset values when no pagination params are in the query', () => {
      const middleware = parsePaginationParams();
      const req = { query: {} } as Request;
      const res = {} as Response;
      const next = jest.fn();
      middleware(req, res, next);
      expect(req.pagination.limit).toBe(50);
      expect(req.pagination.offset).toBe(0);
      expect(next).toHaveBeenCalledWith();
    });

    it('should use the provided default page and perpage values instead of defaults', () => {
      const middleware = parsePaginationParams(2, 1);
      const req = { query: {} } as Request;
      const res = {} as Response;
      const next = jest.fn();
      middleware(req, res, next);
      expect(req.pagination.limit).toBe(1);
      expect(req.pagination.offset).toBe(1);
      expect(next).toHaveBeenCalledWith();
    });

    it('should set limit and offset values based on the query string', () => {
      const middleware = parsePaginationParams();
      const req = { query: { page: 2, perpage: 1 } } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn();
      middleware(req, res, next);
      expect(req.pagination.limit).toBe(1);
      expect(req.pagination.offset).toBe(1);
      expect(next).toHaveBeenCalledWith();
    });

    it('should use default values when non-numeric values are in the query string', () => {
      const middleware = parsePaginationParams();
      const req = {
        query: { page: 'foo', perpage: 'bar' },
      } as unknown as Request;
      const res = {} as Response;
      const next = jest.fn();
      middleware(req, res, next);
      expect(req.pagination.limit).toBe(50);
      expect(req.pagination.offset).toBe(0);
      expect(next).toHaveBeenCalledWith();
    });
  });
});
