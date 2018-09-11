/* @flow */

import supertest from 'supertest';

import { createApp } from '../app';

it('returns simple response', async () => {
  const setup = {
    variables: {
      host: 'http://localhost:3000',
      rootDir: '../../',
    },
    templates: [
      {
        variables: {
          hero: 'spider',
        },
        method: 'get',
        route: '/heroes/<%= hero %>',
        response: {
          body: {
            name: '<%= hero %>',
            photos: '<%= host %>/<%= hero %>/photos',
          },
          status: 200,
        },
      },
    ],
  };

  const app = await createApp(setup);

  return supertest(app)
    .get('/heroes/spider')
    .expect((res) => {
      expect(res.text).toMatchSnapshot();
    })
    .expect(200);
});

it('validates the header', async () => {
  const setup = {
    variables: {
      host: 'http://localhost:3000',
      rootDir: '../../',
    },
    templates: [
      {
        variables: {
          hero: 'spider',
        },
        method: 'get',
        route: '/heroes/<%= hero %>',
        response: {
          body: {
            name: '<%= hero %>',
            photos: '<%= host %>/<%= hero %>/photos',
          },
          status: 200,
        },
        validate: {
          headers: {
            'content-type': {
              toBe: 'application/json',
              error: {
                detail: '<%= hero %> is not feeling well',
              },
              status: 400,
            },
          },
        },
      },
    ],
  };

  const app = await createApp(setup);

  return supertest(app)
    .get('/heroes/spider')
    .set('content-type', 'application/bla')
    .expect((res) => {
      expect(res.text).toMatchSnapshot();
    })
    .expect(400);
});

it('loads an external response body', async () => {
  const setup = {
    variables: {
      host: 'http://localhost:3000',
      rootDir: './',
    },
    templates: [
      {
        variables: {
          hero: 'spider',
        },
        method: 'get',
        route: '/heroes/<%= hero %>',
        response: {
          body: '<%= rootDir %>server/__integrations__/fixture.json',
          status: 200,
        },
      },
    ],
  };

  const app = await createApp(setup);

  return supertest(app)
    .get('/heroes/spider')
    .expect((res) => {
      expect(res.text).toMatchSnapshot();
    })
    .expect(200);
});

it('simulate timeout', async (done) => {
  const timeout = 100;
  const delay = 10;

  const setup = {
    variables: {
      host: 'http://localhost:3000',
      rootDir: './',
    },
    templates: [
      {
        variables: {
          hero: 'spider',
        },
        method: 'get',
        route: '/heroes/<%= hero %>',
        response: {
          body: {},
          status: 200,
        },
        simulate: {
          timeout: timeout + delay,
        },
      },
    ],
  };

  const app = await createApp(setup);

  return supertest(app)
    .get('/heroes/spider')
    .timeout({ response: timeout, deadline: timeout })
    .catch((err) => {
      expect(err.message).toEqual(`Timeout of ${timeout}ms exceeded`);
      done();
    });
});

it('validates body payload', async () => {
  const setup = {
    variables: {
      host: 'http://localhost:3000',
      rootDir: '../../',
    },
    templates: [
      {
        variables: {
          hero: 'spider',
        },
        method: 'post',
        route: '/heroes/<%= hero %>',
        response: {
          body: {
            name: '<%= hero %>',
            photos: '<%= host %>/<%= hero %>/photos',
          },
          status: 200,
        },
        validate: {
          body: {
            name: {
              toBe: 'required',
              error: {
                detail: '<%= hero %> is not feeling well',
              },
              status: 400,
            },
          },
        },
      },
    ],
  };

  const app = await createApp(setup);

  return supertest(app)
    .post('/heroes/spider')
    .send('bla=name is missing')
    .set('Accept', 'application/json')

    .expect((res) => {
      expect(res.text).toMatchSnapshot();
    })
    .expect(400);
});

it('filter router by query string', async () => {
  const setup = {
    variables: {
      host: 'http://localhost:3000',
      rootDir: '../../',
    },
    templates: [
      {
        variables: {
          hero: 'spider',
        },
        method: 'get',
        route: '/heroes/<%= hero %>',
        query: {
          power: 'true',
        },
        response: {
          body: {
            name: '<%= hero %>',
            power: 'spider sense',
          },
          status: 200,
        },
      },
      {
        variables: {
          hero: 'spider',
        },
        method: 'get',
        route: '/heroes/<%= hero %>',
        response: {
          body: {
            name: '<%= hero %>',
            photos: '<%= host %>/<%= hero %>/photos',
          },
          status: 200,
        },
      },
    ],
  };

  const app = await createApp(setup);

  return supertest(app)
    .get('/heroes/spider?power=true')
    .expect((res) => {
      expect(res.text).toMatchSnapshot();
    })
    .expect(200);
});
