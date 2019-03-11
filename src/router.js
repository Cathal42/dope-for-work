import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '*',
    redirect: '/welcome'
  },
  {
    name: 'welcome',
    component: () => import('./view/welcome'),
    meta: {
      title: '欢迎'
    }
  },
  {
    name: 'home',
    component: () => import('./view/home'),
    meta: {
      title: '个人中心'
    }
  },
  {
    name: 'caculate',
    component: () => import('./view/caculate'),
    meta: {
      title: '计算中'
    }
  }
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export {
  router
};
