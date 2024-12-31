import {useEffect, useState} from "react";
import MenuItem from "@/Components/MainMenu/MenuItem";
import {usePage} from "@inertiajs/react";
import {PageProps} from "@/types";
import {icons} from "@/Components/Base/Lucide";

export interface SideMenu {
  icon: keyof typeof icons;
  title: string;
  badge?: number;
  pathname?: string;
  name: string;
  subMenu?: SideMenu[];
  ignore?: boolean;
}

export interface FormattedMenu extends SideMenu {
  active?: boolean;
  activeDropdown?: boolean;
  subMenu?: FormattedMenu[];
  nodeRef?: React.RefObject<HTMLUListElement>;
}

const MainMenu = () => {
  const { mainMenu } = usePage<PageProps>().props;

  const findActiveMenu = (subMenu: SideMenu[]): boolean => {
    let match = false;
    subMenu.forEach((item) => {
      if (((route().current(item.name)) && !item.ignore)) {
        match = true;
      } else if (!match && item.subMenu) {
        match = findActiveMenu(item.subMenu);
      }
    });
    return match;
  };

  const nestedMenu = (menu: Array<SideMenu | string>) => {
    const formattedMenu: Array<FormattedMenu | string> = [];
    menu.forEach((item) => {
      if (typeof item !== "string") {
        const menuItem: FormattedMenu = {
          icon: item.icon,
          title: item.title,
          badge: item.badge,
          pathname: item.pathname,
          name: item.name,
          subMenu: item.subMenu,
          ignore: item.ignore,
        };

        menuItem.active = ((route().current(menuItem.name)) ||
          (menuItem.subMenu && findActiveMenu(menuItem.subMenu))
        ) && !menuItem.ignore;

        if (menuItem.subMenu) {
          menuItem.activeDropdown = findActiveMenu(menuItem.subMenu);

          // Nested menu
          const subMenu: Array<FormattedMenu> = [];
          nestedMenu(menuItem.subMenu).map(
            (menu) => typeof menu !== "string" && subMenu.push(menu)
          );
          menuItem.subMenu = subMenu;
        }

        formattedMenu.push(menuItem);
      } else {
        formattedMenu.push(item);
      }
    });

    return formattedMenu;
  };

  const [formattedMenu, setFormattedMenu] = useState<Array<FormattedMenu | string>>([]);
  const sideMenu = () => nestedMenu(mainMenu);

  useEffect(() => {
    setFormattedMenu(sideMenu());
  }, [mainMenu]);

  return (
    <ul className="scrollable">
      {formattedMenu.map((menu, menuKey) =>
          <MenuItem key={menuKey} menu={menu} setFormattedMenu={setFormattedMenu} />
      )}
    </ul>
  );
};

export default MainMenu;
