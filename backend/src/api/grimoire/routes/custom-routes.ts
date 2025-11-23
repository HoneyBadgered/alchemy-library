export default {
  routes: [
    {
      method: 'PUT',
      path: '/grimoires/:id/approve',
      handler: 'grimoire.approve',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/grimoires/:id/reject',
      handler: 'grimoire.reject',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/grimoires/:id/regenerate',
      handler: 'grimoire.regenerate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
