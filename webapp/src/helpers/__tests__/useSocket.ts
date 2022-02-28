import io, { Socket } from 'socket.io-client';

import useSocket from '../useSocket';

jest.mock('socket.io-client');
const mockIo = jest.mocked(io);

describe('useSocket', () => {
  it('should call io on first being invoked, then return memoized socket on subsequent calls', () => {
    process.env.REACT_APP_API_ORIGIN = 'http://test.api/origin';
    mockIo.mockReturnValue({} as unknown as Socket);
    const socket1 = useSocket();
    expect(mockIo).toHaveBeenCalledWith(process.env.REACT_APP_API_ORIGIN, {
      withCredentials: true,
    });
    const socket2 = useSocket();
    expect(socket1).toBe(socket2);
    expect(mockIo.mock.calls.length).toEqual(1);
    delete process.env.REACT_APP_API_ORIGIN;
  });
});
