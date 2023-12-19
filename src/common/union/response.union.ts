const ResponseStatus = {
  SUCCESS: 'success',
  FAIL: 'fail',
  ERROR: 'error',
} as const;
export type ResponseStatus =
  (typeof ResponseStatus)[keyof typeof ResponseStatus];
