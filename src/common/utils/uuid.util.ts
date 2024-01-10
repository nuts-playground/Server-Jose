import * as uuid_1 from 'uuid';

export const uuidUtil = () => {
  return {
    v1: () => uuid_1.v1(),
    v4: () => uuid_1.v4(),
  };
};
