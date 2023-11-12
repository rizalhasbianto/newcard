import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import NewspaperIcon from '@heroicons/react/24/solid/NewspaperIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import ClipboardDocumentIcon from '@heroicons/react/24/solid/ClipboardDocumentIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import BuildingOfficeIcon from '@heroicons/react/24/solid/BuildingOfficeIcon';
import PencilSquareIcon from '@heroicons/react/24/solid/PencilSquareIcon';
import PuzzlePieceIcon from '@heroicons/react/24/solid/PuzzlePieceIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Qoutes',
    path: '/quotes',
    icon: (
      <SvgIcon fontSize="small">
        <NewspaperIcon />
      </SvgIcon>
    ),
    subMenu: [
      {
        title: 'Add new quote',
        path: '/quotes/add-quote',
        icon: (
          <SvgIcon fontSize="small">
            <PencilSquareIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Add new template',
        path: '/quotes/add-template',
        icon: (
          <SvgIcon fontSize="small">
            <PuzzlePieceIcon />
          </SvgIcon>
        ),
      },
    ]
  },
  {
    title: 'Orders',
    path: '/orders',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Products',
    path: '/products',
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardDocumentIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Companies',
    path: '/companies',
    role: 'admin',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingOfficeIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Account',
    path: '/account',
    role: 'customer',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  }
];
