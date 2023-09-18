import { useState } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Box, ButtonBase, Collapse } from '@mui/material';
import { SubMenu } from './sub-menu'

export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title, subMenu } = props;
  const [hoverMenu, setHoverMenu] = useState("")

  const linkProps = path
    ? external
      ? {
        component: 'a',
        href: path,
        target: '_blank'
      }
      : {
        component: NextLink,
        href: path
      }
    : {};

  function handleHover(title) {
    console.log("button hover", title)
  }

  return (
    <li>
      <ButtonBase
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          pl: '16px',
          pr: '16px',
          py: '6px',
          textAlign: 'left',
          width: '100%',
          ...(active && {
            backgroundColor: 'rgba(255, 255, 255, 0.04)'
          }),
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)'
          }
        }}
        {...linkProps}
        onMouseOver={() => setHoverMenu(title)}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              color: 'neutral.400',
              display: 'inline-flex',
              justifyContent: 'center',
              mr: 2,
              ...(active && {
                color: 'primary.main'
              })
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: 'neutral.400',
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: '24px',
            whiteSpace: 'nowrap',
            ...(active && {
              color: 'common.white'
            }),
            ...(disabled && {
              color: 'neutral.500'
            })
          }}
        >
          {title}
        </Box>
      </ButtonBase>
      {subMenu &&
        <Collapse in={active}>
          <Box
            sx={{
              mb: '10px',
              borderBottom: 1,
              pt: '10px',
              pb: '10px',
              borderColor: '#243046'
            }}
          > {
              subMenu?.map((sub, i) =>
                <SubMenu
                  key={"sub-" + i}
                  icon={sub.icon}
                  path={sub.path}
                  title={sub.title}
                />

              )
            }
          </Box>
        </Collapse>
      }
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired
};
