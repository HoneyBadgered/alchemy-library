export default {
  routes: [
    {
      method: 'PUT',
      path: '/logs/:id/approve',
      handler: 'log.approve',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/logs/:id/reject',
      handler: 'log.reject',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/logs/:id/regenerate',
      handler: 'log.regenerate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
