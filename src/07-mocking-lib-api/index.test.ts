// Uncomment the code below and write your tests
import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));
describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should create instance with provided base url', async () => {
    const axiosCreateSpy = jest.spyOn(axios, 'create').mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: {} }),
      defaults: {},
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    } as unknown as AxiosInstance);

    await throttledGetDataFromApi('/test-path');

    expect(axiosCreateSpy).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockAxiosInstance = {
      get: jest.fn().mockResolvedValue({ data: { result: 'test' } }),
    };
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

    await throttledGetDataFromApi('/test-path');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-path');
  });

  test('should return response data', async () => {
    const mockData = { result: 'test' };
    const mockAxiosInstance = {
      get: jest.fn().mockResolvedValue({ data: mockData }),
    };
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

    const result = await throttledGetDataFromApi('/test-path');

    expect(result).toEqual(mockData);
  });
});
