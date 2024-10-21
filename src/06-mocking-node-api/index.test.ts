import {
  doStuffByInterval,
  doStuffByTimeout,
  readFileAsynchronously,
} from './index';

import { join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

jest.mock('path');
jest.mock('fs');
jest.mock('fs/promises');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const mockTimeout = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    const timeout = 5;
    doStuffByTimeout(callback, timeout);

    expect(mockTimeout).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenLastCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    const timeout = 5;
    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const mockTimeout = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const timeout = 5;
    doStuffByInterval(callback, timeout);

    expect(mockTimeout).toHaveBeenCalled();
    expect(mockTimeout).toHaveBeenLastCalledWith(callback, timeout);
  });

  test('should call callback multiple times after multiple intervals', () => {
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const timeout = 5;
    const expectedCalls = 5;
    doStuffByInterval(callback, timeout);

    jest.advanceTimersByTime(timeout * expectedCalls);

    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(expectedCalls);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const path = 'test.txt';
    (join as jest.Mock).mockReturnValue(path);

    await readFileAsynchronously(path);

    expect(join).toHaveBeenCalledWith(expect.any(String), path);
  });

  test('should return null if file does not exist', async () => {
    (join as jest.Mock).mockReturnValue('test');
    (existsSync as jest.Mock).mockReturnValue(false);

    expect(await readFileAsynchronously('test.txt')).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const mockContent = 'test-file-content';
    const path = 'test.txt';
    (join as jest.Mock).mockReturnValue(path);
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(Buffer.from(mockContent));

    expect(await readFileAsynchronously(path)).toBe(mockContent);
  });
});
