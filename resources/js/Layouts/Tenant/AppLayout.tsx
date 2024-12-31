import "/resources/css/themes/shuriken.css";
import "/resources/css/vendors/simplebar.css";
import React, {useState, useEffect, createRef, PropsWithChildren} from "react";
import clsx from "clsx";
import SimpleBar from "simplebar";
import Breadcrumb from "@/Components/Base/Breadcrumb";
import MainMenu from "@/Components/MainMenu";
import Lucide from "@/Components/Base/Lucide";
import {Menu} from "@/Components/Base/Headless";
import QuickSearch from "@/Components/QuickSearch";
import SwitchAccount from "@/Components/SwitchAccount";
import NotificationsPanel from "@/Components/NotificationsPanel";
import ActivitiesPanel from "@/Components/ActivitiesPanel";
import {usePage} from "@inertiajs/react";
import {PageProps} from "@/types";
import {
  selectCompactMenu,
  setCompactMenu as setCompactMenuStore,
} from "@/Stores/compactMenuSlice";
import {useAppDispatch, useAppSelector} from "@/Stores/hooks";

import users from "@/fakers/users";

export default function App({children}: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const compactMenu = useAppSelector(selectCompactMenu);
  const { mainMenu, breadcrumbs } = usePage<PageProps>().props;

  const setCompactMenu = (val: boolean) => {
    localStorage.setItem("compactMenu", val.toString());
    dispatch(setCompactMenuStore(val));
  };
  //States
  const [quickSearch, setQuickSearch] = useState(false);
  const [switchAccount, setSwitchAccount] = useState(false);
  const [notificationsPanel, setNotificationsPanel] = useState(false);
  const [activitiesPanel, setActivitiesPanel] = useState(false);
  const [compactMenuOnHover, setCompactMenuOnHover] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);

  //Refs
  const scrollableRef = createRef<HTMLDivElement>();
  const [topBarActive, setTopBarActive] = useState(false);


  const toggleCompactMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setCompactMenu(!compactMenu);
  };

  const compactLayout = () => {
    if (window.innerWidth <= 1600) {
      setCompactMenu(true);
    }
  };

  const requestFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    }
  };

  useEffect(() => {
    if (scrollableRef.current) {
      new SimpleBar(scrollableRef.current);
    }

    // setFormattedMenu(sideMenu());
    compactLayout();

    window.onresize = () => {
      compactLayout();
    };
  }, [mainMenu]);

  window.onscroll = () => {
    // Topbar
    if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      setTopBarActive(true);
    } else {
      setTopBarActive(false);
    }
  };

  return (
    <div
      className={clsx([
        "shuriken",
        "before:content-[''] before:z-[-1] before:w-screen before:bg-slate-50 before:top-0 before:h-screen before:fixed before:bg-texture-black before:bg-contain before:bg-fixed before:bg-[center_-20rem] before:bg-no-repeat",
      ])}
    >
      <div
        className={clsx([
          "xl:ml-0 shadow-xl transition-[margin,padding] duration-300 xl:shadow-none fixed top-0 left-0 z-50 side-menu group",
          "after:content-[''] after:fixed after:inset-0 after:bg-black/80 after:xl:hidden",
          {"side-menu--collapsed": compactMenu},
          {"side-menu--on-hover": compactMenuOnHover},
          {"ml-0 after:block": activeMobileMenu},
          {"-ml-[275px] after:hidden": !activeMobileMenu},
        ])}
      >
        <div
          className={clsx([
            "fixed ml-[275px] w-10 h-10 items-center justify-center xl:hidden z-50",
            {flex: activeMobileMenu},
            {hidden: !activeMobileMenu},
          ])}
        >
          <a
            href=""
            onClick={(event) => {
              event.preventDefault();
              setActiveMobileMenu(false);
            }}
            className="mt-5 ml-5"
          >
            <Lucide icon="X"
                    className="w-8 h-8 text-white" />
          </a>
        </div>
        <div
          className={clsx([
            "bg-slate-50 z-20 relative w-[275px] border-dashed border-slate-300/80 duration-300 transition-[width] group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:border-slate-100 group-[.side-menu--collapsed.side-menu--on-hover]:xl:border-solid group-[.side-menu--collapsed.side-menu--on-hover]:xl:shadow-[6px_0_12px_-4px_#0000000f] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px] overflow-hidden border-r h-screen flex flex-col",
            "before:content-[''] before:transition-colors before:w-screen before:h-screen before:absolute before:bg-texture-black before:bg-contain before:bg-fixed before:bg-[center_-20rem] before:bg-no-repeat before:bg-slate-50 group-[.side-menu--collapsed.side-menu--on-hover]:xl:before:bg-white",
          ])}
          onMouseOver={(event) => {
            event.preventDefault();
            setCompactMenuOnHover(true);
          }}
          onMouseLeave={(event) => {
            event.preventDefault();
            setCompactMenuOnHover(false);
          }}
        >
          <div className="flex-none hidden xl:flex items-center z-10 px-5 h-[65px] mt-2 w-[275px] overflow-hidden relative duration-300 group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px]">
            <a
              href=""
              className="flex items-center transition-[margin] duration-300 group-[.side-menu--collapsed]:xl:ml-2 group-[.side-menu--collapsed.side-menu--on-hover]:xl:ml-0"
            >
              <div className="flex items-center justify-center w-[34px] rounded-lg h-[34px] bg-gradient-to-r from-theme-1 to-theme-2 transition-transform ease-in-out group-[.side-menu--collapsed.side-menu--on-hover]:xl:-rotate-180">
                <div className="w-[16px] h-[16px] relative -rotate-45 [&_div]:bg-white">
                  <div className="absolute w-[21%] left-0 inset-y-0 my-auto rounded-full opacity-50 h-[75%]"></div>
                  <div className="absolute w-[21%] inset-0 m-auto h-[120%] rounded-full"></div>
                  <div className="absolute w-[21%] right-0 inset-y-0 my-auto rounded-full opacity-50 h-[75%]"></div>
                </div>
              </div>
              <div className="ml-3.5 group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100 group-[.side-menu--collapsed]:xl:opacity-0 transition-opacity font-medium">
                GARDERS
              </div>
            </a>
            <a
              href=""
              onClick={toggleCompactMenu}
              className="group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100 group-[.side-menu--collapsed]:xl:rotate-180 group-[.side-menu--collapsed]:xl:opacity-0 transition-[opacity,transform] hidden 3xl:flex items-center justify-center w-[20px] h-[20px] ml-auto border rounded-full border-slate-600/40 hover:bg-slate-600/5"
            >
              <Lucide icon="ArrowLeft"
                      className="w-3.5 h-3.5 stroke-[1.3]" />
            </a>
          </div>
          <div
            ref={scrollableRef}
            className={clsx([
              "w-full h-full z-20 px-5 overflow-y-auto overflow-x-hidden pb-3 [-webkit-mask-image:-webkit-linear-gradient(top,rgba(0,0,0,0),black_30px)] [&:-webkit-scrollbar]:w-0 [&:-webkit-scrollbar]:bg-transparent",
              "[&_.simplebar-content]:p-0 [&_.simplebar-track.simplebar-vertical]:w-[10px] [&_.simplebar-track.simplebar-vertical]:mr-0.5 [&_.simplebar-track.simplebar-vertical_.simplebar-scrollbar]:before:bg-slate-400/30",
            ])}
          >
            <MainMenu></MainMenu>
          </div>
        </div>
        <div
          className={clsx([
            "fixed h-[65px] transition-[margin] duration-100 xl:ml-[275px] group-[.side-menu--collapsed]:xl:ml-[90px] mt-2 inset-x-0 top-0",
            "before:content-[''] before:mx-5 before:absolute before:top-0 before:inset-x-0 before:-mt-[15px] before:h-[20px] before:backdrop-blur",
          ])}
        >
          <div
            className={clsx([
              "top-bar absolute inset-x-0 h-full mx-5 group",
              topBarActive && "top-bar--active",
            ])}
          >
            <div
              className="
                container flex items-center w-full h-full transition-[padding,background-color,border-color] ease-in-out duration-300 box bg-transparent border-transparent shadow-none
                group-[.top-bar--active]:box group-[.top-bar--active]:px-5
              "
            >
              <div className="flex items-center gap-1 xl:hidden">
                <a
                  href=""
                  onClick={(event) => {
                    event.preventDefault();
                    setActiveMobileMenu(true);
                  }}
                  className="p-2 rounded-full hover:bg-slate-100"
                >
                  <Lucide icon="AlignJustify"
                          className="w-[18px] h-[18px]" />
                </a>
                <a
                  href=""
                  className="p-2 rounded-full hover:bg-slate-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setQuickSearch(true);
                  }}
                >
                  <Lucide icon="Search"
                          className="w-[18px] h-[18px]" />
                </a>
              </div>
              {/* BEGIN: Breadcrumb */}
              {/*<Breadcrumb className="flex-1 hidden xl:block">*/}
              {/*  {breadcrumbs.map((breadcrumb, breadcrumbKey) =>*/}
              {/*    <Breadcrumb.Link key={breadcrumbKey} to={breadcrumb.url} active={breadcrumb.active}>*/}
              {/*      {breadcrumb.title}*/}
              {/*    </Breadcrumb.Link>*/}
              {/*  )}*/}
              {/*</Breadcrumb>*/}
              {/* END: Breadcrumb */}
              {/* BEGIN: Search */}
              <div
                className="relative justify-center flex-1 hidden xl:flex"
                onClick={() => setQuickSearch(true)}
              >
                <div
                  className="
                    box w-[350px] flex items-center py-2 px-3.5 text-slate-400 cursor-pointer hover:bg-white/60 transition-colors
                    group-[.top-bar--active]:shadow-none group-[.top-bar--active]:bg-slate-50 group-[.top-bar--active]:hover:bg-slate-100
                "
                >
                  <Lucide icon="Search"
                          className="w-[18px] h-[18px]" />
                  <div className="ml-2.5 mr-auto">Quick search...</div>
                  <div>⌘K</div>
                </div>
              </div>
              <QuickSearch
                quickSearch={quickSearch}
                setQuickSearch={setQuickSearch}
              />
              {/* END: Search */}
              {/* BEGIN: Notification & User Menu */}
              <div className="flex items-center flex-1">
                <div className="flex items-center gap-1 ml-auto">
                  <a
                    href=""
                    className="p-2 rounded-full hover:bg-slate-200/50 group-[.top-bar--active]:hover:bg-slate-50"
                    onClick={(e) => {
                      e.preventDefault();
                      setActivitiesPanel(true);
                    }}
                  >
                    <Lucide icon="LayoutGrid"
                            className="w-[18px] h-[18px]" />
                  </a>
                  {/* <a href="" className="p-2 rounded-full hover:bg-slate-200/50 group-[.top-bar--active]:hover:bg-slate-50">
                    <Lucide icon="Moon" className="w-[18px] h-[18px]" />
                  </a> */}
                  <a
                    href=""
                    className="p-2 rounded-full hover:bg-slate-200/50 group-[.top-bar--active]:hover:bg-slate-50"
                    onClick={(e) => {
                      e.preventDefault();
                      requestFullscreen();
                    }}
                  >
                    <Lucide icon="Expand"
                            className="w-[18px] h-[18px]" />
                  </a>
                  <a
                    href=""
                    className="p-2 rounded-full hover:bg-slate-200/50 group-[.top-bar--active]:hover:bg-slate-50"
                    onClick={(e) => {
                      e.preventDefault();
                      setNotificationsPanel(true);
                    }}
                  >
                    <Lucide icon="Bell"
                            className="w-[18px] h-[18px]" />
                  </a>
                </div>
                <Menu className="ml-5">
                  <Menu.Button className="overflow-hidden rounded-full w-[36px] h-[36px] border-[3px] border-slate-200/70 image-fit">
                    <img
                      alt="Tailwise - Admin Dashboard Template"
                      src={users.fakeUsers()[0].photo}
                    />
                  </Menu.Button>
                  <Menu.Items className="w-56 mt-1">
                    <Menu.Item href=''
                      onClick={(e) => {
                        e.preventDefault();
                        setSwitchAccount(true);
                      }}
                    >
                      <Lucide icon="ToggleLeft"
                              className="w-4 h-4 mr-2" />
                      Switch Account
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item href={route('dashboard')}>
                      <Lucide icon="Settings"
                              className="w-4 h-4 mr-2" />
                      Connected Services
                    </Menu.Item>
                    <Menu.Item href={route('dashboard')}>
                      <Lucide icon="Inbox"
                              className="w-4 h-4 mr-2" />
                      Email Settings
                    </Menu.Item>
                    <Menu.Item href={route('dashboard')}>
                      <Lucide icon="Lock"
                              className="w-4 h-4 mr-2" />
                      Reset Password
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item href={route('dashboard')}>
                      <Lucide icon="Users"
                              className="w-4 h-4 mr-2" />
                      Profile Info
                    </Menu.Item>
                    <Menu.Item href={route('logout')} method='post' as='button'>
                        <Lucide icon="Power"
                                className="w-4 h-4 mr-2" />
                        Logout
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
              <ActivitiesPanel
                activitiesPanel={activitiesPanel}
                setActivitiesPanel={setActivitiesPanel}
              />
              <NotificationsPanel
                notificationsPanel={notificationsPanel}
                setNotificationsPanel={setNotificationsPanel}
              />
              <SwitchAccount
                switchAccount={switchAccount}
                setSwitchAccount={setSwitchAccount}
              />
              {/* END: Notification & User Menu */}
            </div>
          </div>
        </div>
      </div>
      <div
        className={clsx([
          "transition-[margin,width] duration-100 px-5 pt-[56px] pb-16 z-10 relative",
          {"xl:ml-[275px]": !compactMenu},
          {"xl:ml-[91px]": compactMenu},
        ])}
      >
        <div className="container mt-[65px]">
          {children}
        </div>
      </div>
    </div>
  )
    ;
}
