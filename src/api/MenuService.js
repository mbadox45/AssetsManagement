export const menu_role_distributor =  [
    {
        label: 'Menu',
        items: [
            { label: 'Beranda', icon: 'pi pi-fw pi-home', to: '/beranda' },
            { label: 'Survey', icon: 'pi pi-fw pi-comments', to: '/survey-user' },
        ]
    },
    {
        label: 'Profile',
        items: [
            { label: 'Update Password', icon: 'pi pi-fw pi-lock', to: '/update-password' },
        ]
    },
]

export const menu_role_under_8 = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'BAST',
        items: [
            { label: 'Submission', icon: 'pi pi-fw pi-verified', to: '/serah-terima', },
        ]
    },
]

export const menu_role_min_8 = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Master',
        items: [
            { label: 'Area', icon: 'pi pi-fw pi-map-marker', to: '/area', },
            { label: 'Group', icon: 'pi pi-fw pi-sitemap', to: '/group',},
        ]
    },
    {
        label: 'Asset',
        items: [
            { label: 'Fixed Assets', icon: 'pi pi-fw pi-check-circle', to: '/fix-asset',},
        ]
    },
]

export const menu_role_min_9 = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    
    {
        label: 'Master',
        items: [
            { label: 'Adjustment', icon: 'pi pi-fw pi-cog', to: '/adjustment', },
            { label: 'Area', icon: 'pi pi-fw pi-map-marker', to: '/area', },
            { label: 'Supplier', icon: 'pi pi-fw pi-box', to: '/supplier',},
            { label: 'MIS', icon: 'pi pi-fw pi-shield', to: '/mis',},
            { label: 'Group', icon: 'pi pi-fw pi-sitemap', to: '/group',},
        ]
    },
    {
        label: 'Asset',
        items: [
            { label: 'Fixed Assets', icon: 'pi pi-fw pi-check-circle', to: '/fix-asset',},
        ]
    },
    {
        label: 'Journal',
        items: [
            { label: 'Asset Recognition', icon: 'pi pi-fw pi-star', to: '/pengakuan',},
            { label: 'Asset Depreciation', icon: 'pi pi-fw pi-sun', to: '/depresiasi',},
            { label: 'Correction', icon: 'pi pi-fw pi-bookmark', to: '/koreksi',},
        ]
    },
]
