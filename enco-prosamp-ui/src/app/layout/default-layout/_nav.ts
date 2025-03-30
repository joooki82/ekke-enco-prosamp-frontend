import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Encotech - alapadatok'
  },
  {
    name: 'Laboratórium',
    url: '/laboratorium',
    iconComponent: { name: 'cil-filter' },
    children: [
      {
        name: 'Mintavételi beállítás',
        url: '/laboratorium/adjustment-method',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Szennyezőanyag csoport',
        url: '/laboratorium/contaminant-group',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Szennyezőanyag',
        url: '/laboratorium/contaminant',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Eszközök',
        url: '/laboratorium/equipment',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Mértékegységek',
        url: '/laboratorium/measurement-unit',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Szabványok',
        url: '/laboratorium/standard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Mintavételi típusok',
        url: '/laboratorium/sampling-type',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Partnerek',
    url: '/partners',
    iconComponent: { name: 'cil-factory' },
    children: [
      {
        name: 'Megbízók',
        url: '/partners/client',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Szennyező cég',
        url: '/partners/company',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Telephelyek',
        url: '/partners/location',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Labroatórium',
        url: '/partners/laboratory',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Encotech - munkák'
  },
  {
    name: 'Projektek',
    url: '/projects',
    iconComponent: { name: 'cil-puzzle' }
  },
  {
    title: true,
    name: 'Encotech - mintavétel'
  },
  {
    name: 'Mintavétel',
    url: '/sampling',
    iconComponent: { name: 'cil-running' },
    children: [
      {
        name: 'Mintavételi jegyzőkönyvek',
        url: '/sampling/sampling-record-dat-m200',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Minták',
        url: '/sampling/samples',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    title: true,
    name: 'Encotech - vizsgálatok'
  },
  {
    name: 'Vizsgálatok',
    url: '/analytics',
    iconComponent: { name: 'cil-running' },
    children: [
      {
        name: 'Vizsgálandó szennyezők',
        url: '/analytics/sample-contaminant-link',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Vizsgálati eredmények',
        url: '/analytics/sample-analytical-result',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Encotech - jegyzőkönyvek'
  },
  {
    name: 'Jegyzőkönyvek',
    url: '/reports',
    iconComponent: { name: 'cil-description' },
    children: [
      {
        name: 'Analitikai jegyzőkönyvek',
        url: '/reports/analytical-lab-report',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Vizsgálati jegyzőkönyvek',
        url: '/reports/test-report',
        icon: 'nav-icon-bullet'
      },
    ]
  }
];
