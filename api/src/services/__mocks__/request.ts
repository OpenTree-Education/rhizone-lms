import { SuperAgentStatic } from 'superagent';

const request = jest.fn() as unknown as SuperAgentStatic;
request.get = jest.fn();
request.post = jest.fn();

export default request;
