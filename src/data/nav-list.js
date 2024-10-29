import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import NewspaperIcon from '@heroicons/react/24/solid/NewspaperIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import ClipboardDocumentIcon from '@heroicons/react/24/solid/ClipboardDocumentIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import BuildingOfficeIcon from '@heroicons/react/24/solid/BuildingOfficeIcon';
import PencilSquareIcon from '@heroicons/react/24/solid/PencilSquareIcon';
import PuzzlePieceIcon from '@heroicons/react/24/solid/PuzzlePieceIcon';
import EmailIcon from '@mui/icons-material/Email';
import InventoryIcon from '@mui/icons-material/Inventory';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Overview',
    path: '/dashboard',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Qoutes',
    path: '/dashboard/quotes',
    icon: (
      <SvgIcon fontSize="small">
        <NewspaperIcon />
      </SvgIcon>
    ),
    subMenu: [
      {
        title: 'Add new quote',
        path: '/dashboard/quotes/add-quote',
        icon: (
          <SvgIcon fontSize="small">
            <PencilSquareIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Quote collections',
        path: '/dashboard/quotes/collections',
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
    path: '/dashboard/orders',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Products',
    path: '/dashboard/products',
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardDocumentIcon />
      </SvgIcon>
    ),
    subMenu: [
      {
        title: 'Inventory',
        path: '/dashboard/products/inventory',
        role: ['admin', 'sales'],
        icon: (
          <SvgIcon fontSize="small">
            <InventoryIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Catalogs',
        path: '/products/catalogs',
        role: ['admin', 'sales'],
        icon: (
          <SvgIcon fontSize="small">
            <CategoryIcon />
          </SvgIcon>
        ),
      },
    ]
  },
  {
    title: 'Companies',
    path: '/dashboard/companies',
    role: ['admin', 'sales'],
    icon: (
      <SvgIcon fontSize="small">
        <BuildingOfficeIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Tickets',
    path: '/dashboard/tickets',
    icon: (
      <SvgIcon fontSize="small">
        <EmailIcon />
      </SvgIcon>
    ),
    subMenu: [
      {
        title: 'Create Ticket',
        path: '/dashboard/tickets/add-ticket',
        icon: (
          <SvgIcon fontSize="small">
            <PencilSquareIcon />
          </SvgIcon>
        ),
      },
    ]
  },
  {
    title: 'Users',
    path: '/dashboard/users',
    role: ["admin", "sales"],
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Account',
    path: '/dashboard/account',
    role: ['customer'],
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  }
];
