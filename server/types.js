/* @flow */

export type Variables = {
  [key: string]: string,
};

export type Template = {
  variables: Variables,
  method: 'get' | 'post' | 'put',
  route: string,
  response: {
    body: | {
          [key: string]: string,
        }
      | string,
    error?: {
      [key: string]: string,
    },
    status: number,
  },
  validate?: {
    headers?: {
      [key: string]: string,
    },
    validate?: {
      [key: string]: 'required',
    },
  },
  simulate?: {
    timeout?: number,
  },
};

export type Setup = {
  variables: Variables,
  templates: Array<Template>,
};
