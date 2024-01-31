import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
// import AppLayout2 from '@/layout/layout_sso/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            redirect:'/home',
            children: [
                // Distributor

                {
                    path: '/serah-terima',
                    name: 'serah-terima',
                    component: () => import('@/views/asmen/bast/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        user:true,
                    }
                },

                // Administrator
                {
                    path: '/home',
                    name: 'home',
                    component: () => import('@/views/asmen/home/Home.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        dept:true,
                        user:true,
                    }
                },

                // Asset Management
                // Master
                {
                    path: '/adjustment',
                    name: 'adjustment',
                    component: () => import('@/views/asmen/master/adjustment/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/area',
                    name: 'area',
                    component: () => import('@/views/asmen/master/area/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        dept:true,
                    }
                },
                {
                    path: '/supplier',
                    name: 'supplier',
                    component: () => import('@/views/asmen/master/supplier/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/mis',
                    name: 'mis',
                    component: () => import('@/views/asmen/master/mis/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/group',
                    name: 'group',
                    component: () => import('@/views/asmen/master/group/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        dept:true,
                    }
                },
                // Assets
                {
                    path: '/fix-asset',
                    name: 'fix-asset',
                    component: () => import('@/views/asmen/aset/fixedassets/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        dept:true,
                        admin:true,
                    }
                },
                {
                    path: '/fixed-asset',
                    name: 'fixed-asset',
                    component: () => import('@/views/asmen/aset/fixedassets/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        dept:true,
                    }
                },
                {
                    path: '/form-asset/:cond',
                    name: 'form-asset',
                    component: () => import('@/views/asmen/aset/fixedassets/FormAssets.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                // Journal
                {
                    path: '/pengakuan',
                    name: 'pengakuan',
                    component: () => import('@/views/asmen/jurnal/Pengakuan.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/depresiasi',
                    name: 'depresiasi',
                    component: () => import('@/views/asmen/jurnal/Depresiasi.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/koreksi',
                    name: 'koreksi',
                    component: () => import('@/views/asmen/jurnal/Koreksi.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },

            ]
        },
        {
            path: '/bast/:cond',
            name: 'bast',
            component: () => import('@/views/asmen/bast/components/BastLayout.vue'),
            meta:{
                requiresAuth: true,
                admin:true,
                dept:true,
                user:true,
            }
        },
        {
            path: '/sign-out',
            name: 'signout',
            component: () => import('@/views/asmen/signin/SignOut.vue'),
            meta:{
                requiresAuth: true,
                dept:true,
            }
        },
        {
            path: '/auth/out-session',
            name: 'out-session',
            component: () => import('@/views/pages/auth/Login2.vue'),
            meta:{
                guestOnly:true,
            }
        },
        {
            path: '/verify/:id',
            name: 'verify',
            component: () => import('@/views/asmen/signin/Verify.vue'),
            meta:{
                guestOnly:true,
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/asmen/notfound/NotFound.vue')
        },
    ]
});

router.beforeEach((to, from, next) => {
    const tokens = localStorage.getItem('usertoken') != null;
    const roles = localStorage.getItem('roles');
    // console.log(roles);

    if (to.matched.some((route) => route.meta.requiresAuth)) {
        if (tokens) {
            if (roles == 10) {
                if (to.matched.some((route) => route.meta.admin)) {
                    next();
                } else {
                    next('/home');
                }
            } else if (roles == 8) {
                if (to.matched.some((route) => route.meta.dept)) {
                    next();
                } else {
                    next('/home');
                }
            } else {
                if (to.matched.some((route) => route.meta.user)) {
                    next();
                } else {
                    next('/home');
                }
            }
        } else {
            next('/auth/out-session');
        }
    } else if (to.matched.some((route) => route.meta.guestOnly)) {
        if (tokens) {
            if (roles == 10) {
                next('/home');
            } else if (roles == 8) {
                next('/home');
            } else {
                next('/home');
            }
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;
