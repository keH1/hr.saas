import clsx from "clsx";
import Lucide from "@/Components/Base/Lucide";
import { Transition } from "react-transition-group";
import { SideMenu } from "@/Components/MainMenu";
import { slideUp, slideDown } from "@/Utils/helper";
import {MouseEvent, Dispatch, RefObject, SetStateAction, useRef} from "react";
import { router } from '@inertiajs/react';

export interface FormattedMenu extends SideMenu {
  active?: boolean;
  activeDropdown?: boolean;
  subMenu?: FormattedMenu[];
  nodeRef?: RefObject<HTMLUListElement>;
}

interface MenuItemProps {
  menu: FormattedMenu | string;
  setFormattedMenu: Dispatch<SetStateAction<(FormattedMenu | string)[]>>;
}

const MenuItem = ({ menu, setFormattedMenu }: MenuItemProps) => {
  const nodeRef = useRef<HTMLUListElement>(null);

  if (typeof menu === "string") {
    return (
      <li className="side-menu__divider">
        {menu}
      </li>
    );
  }

  const handleClick = () => {
    setFormattedMenu((prev) => [...prev]);
  };

  const linkTo = (menu: FormattedMenu) => {
    if (menu.subMenu) {
      menu.activeDropdown = !menu.activeDropdown;
    } else {
    if (menu.pathname !== undefined) {
      router.visit(menu.pathname);
    }
  }
  };

  return (
    <li>
      <a
        href={menu.pathname}
        className={clsx([
          "side-menu__link",
          { "side-menu__link--active": menu.active },
          { "side-menu__link--active-dropdown": menu.activeDropdown },
        ])}
        onClick={(event: MouseEvent) => {
          event.preventDefault();
          linkTo(menu);
          handleClick();
        }}
      >
        <Lucide icon={menu.icon} className="side-menu__link__icon" />
        <div className="side-menu__link__title">{menu.title}</div>
        {menu.badge && (
          <div className="side-menu__link__badge">{menu.badge}</div>
        )}
        {menu.subMenu && (
          <Lucide icon="ChevronDown" className="side-menu__link__chevron" />
        )}
      </a>
      {menu.subMenu && (
        <Transition
          in={menu.activeDropdown}
          timeout={300}
          nodeRef={nodeRef}
          onEnter={() => nodeRef.current && slideDown(nodeRef.current, 300)}
          onExit={() => nodeRef.current && slideUp(nodeRef.current, 300)}
        >
          <ul
            ref={nodeRef}
            className={clsx([
              "",
              { block: menu.activeDropdown },
              { hidden: !menu.activeDropdown },
            ])}
          >
            {menu.subMenu.map((subMenu, subMenuKey) => (
              <MenuItem key={subMenuKey} menu={subMenu} setFormattedMenu={setFormattedMenu} />
            ))}
          </ul>
        </Transition>
      )}
    </li>
  );
};

export default MenuItem;
