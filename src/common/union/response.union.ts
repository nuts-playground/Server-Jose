const ResponseStatus = {
  SUCCESS: 'success',
  FAIL: 'fail',
  ERROR: 'error',
  EXCEPTION: 'exception',
} as const;
export type ResponseStatus =
  (typeof ResponseStatus)[keyof typeof ResponseStatus];
