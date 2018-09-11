/* @flow */

type Dictionary = {
  [key: string]: string,
};

export type Variables = Dictionary;

export type Template = {
  variables: Variables,
  method: 'get' | 'post' | 'put',
  route: string,
  response: {
    body: Dictionary | string,
    error?: Dictionary,
    status: number,
  },
  validate?: {
    headers?: {
      [key: string]: {
        toBe: string,
        error: Dictionary,
        status: number,
      },
    },
    body?: {
      [key: string]: {
        toBe: 'required',
        error: Dictionary,
        status: number,
      },
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
