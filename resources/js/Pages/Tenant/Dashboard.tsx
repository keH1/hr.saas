import AppLayout from '@/Layouts/Tenant/AppLayout';
import {Head} from '@inertiajs/react';
import Lucide from "@/Components/Base/Lucide";
import {Menu} from "@/Components/Base/Headless";

export default function Dashboard() {
  return (
    <AppLayout>
      <Head title="Dashboard" />

      <div className="grid grid-cols-12 gap-y-10 gap-x-6">
        <div className="col-span-12">
          <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
            <div className="text-base font-medium group-[.mode--light]:text-white">
              Ключевая сводка
            </div>
          </div>
          <div className="mt-3.5 box box--stacked">
            <div className="flex flex-col xl:flex-row gap-2 p-1.5 leading-relaxed">
              <div className="grid w-full grid-cols-4 gap-2">
                <div className="col-span-4 sm:col-span-2 xl:col-span-1 bg-gradient-to-b from-theme-2/90 to-theme-1/[0.85] flex-1 p-5 border-0 relative rounded-[0.6rem] box border-slate-200/60 bg-slate-50 overflow-hidden before:content-[''] before:w-full before:h-[130%] before:bg-gradient-to-b before:from-black/[0.15] before:to-transparent before:absolute before:right-0 before:top-0 before:rotate-45 before:-mr-[62%]">
                  <div className="flex items-center justify-center w-12 h-12 border rounded-full border-white/10 bg-white/10">
                    <Lucide
                      icon="Database"
                      className="w-6 h-6 text-white fill-white/10"
                    />
                  </div>
                  <div className="flex items-center mt-12">
                    <div className="text-2xl font-medium text-white">
                      247,220
                    </div>
                    <div className="flex items-center ml-3.5 border border-success/50 bg-success/50 rounded-full pl-[7px] pr-1 py-[2px] text-xs font-medium text-white/90 dark:bg-white/10">
                      12%
                      <Lucide
                        icon="ChevronUp"
                        className="w-4 h-4 ml-px stroke-[1.5]"
                      />
                    </div>
                  </div>
                  <div className="mt-1 text-base text-white/70">
                    Количество участков
                  </div>
                  <Menu className="absolute top-0 right-0 mt-5 mr-5">
                    <Menu.Button className="w-5 h-5 text-slate-500">
                      <Lucide
                        icon="MoreVertical"
                        className="w-6 h-6 stroke-white/70 fill-white/70"
                      />
                    </Menu.Button>
                    <Menu.Items className="w-40">
                      <Menu.Item href="#">
                        <Lucide icon="Copy" className="w-4 h-4 mr-2" /> Copy
                                                                        Link
                      </Menu.Item>
                      <Menu.Item href="#">
                        <Lucide icon="Trash" className="w-4 h-4 mr-2" />
                        Delete
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
                <div className="col-span-4 sm:col-span-2 xl:col-span-1 flex-1 p-5 border relative rounded-[0.6rem] bg-slate-50/50 overflow-hidden dark:bg-darkmode-400">
                  <div className="flex items-center justify-center w-12 h-12 border rounded-full border-primary/10 bg-primary/10">
                    <Lucide
                      icon="AppWindow"
                      className="w-6 h-6 text-primary fill-primary/10"
                    />
                  </div>
                  <div className="flex items-center mt-12">
                    <div className="text-2xl font-medium">124,625</div>
                    <div className="flex items-center ml-3.5 border border-danger/50 bg-danger/70 rounded-full pl-[7px] pr-1 py-[2px] text-xs font-medium text-white/90">
                      3%
                      <Lucide
                        icon="ChevronDown"
                        className="w-4 h-4 ml-px stroke-[1.5]"
                      />
                    </div>
                  </div>
                  <div className="mt-1 text-base text-slate-500">
                    Зарегистрировано садоводов
                  </div>
                  <Menu className="absolute top-0 right-0 mt-5 mr-5">
                    <Menu.Button className="w-5 h-5 text-slate-500">
                      <Lucide
                        icon="MoreVertical"
                        className="w-6 h-6 stroke-slate-400/70 fill-slate-400/70"
                      />
                    </Menu.Button>
                    <Menu.Items className="w-40">
                      <Menu.Item href="#">
                        <Lucide icon="Copy" className="w-4 h-4 mr-2" /> Copy
                                                                        Link
                      </Menu.Item>
                      <Menu.Item href="#">
                        <Lucide icon="Trash" className="w-4 h-4 mr-2" />
                        Delete
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
                <div className="col-span-4 sm:col-span-2 xl:col-span-1 flex-1 p-5 border relative rounded-[0.6rem] bg-slate-50/50 overflow-hidden dark:bg-darkmode-400">
                  <div className="flex items-center justify-center w-12 h-12 border rounded-full border-info/10 bg-info/10">
                    <Lucide
                      icon="Box"
                      className="w-6 h-6 text-info fill-info/10"
                    />
                  </div>
                  <div className="flex items-center mt-12">
                    <div className="text-2xl font-medium">749,220</div>
                    <div className="flex items-center ml-3.5 border border-success/50 bg-success/70 rounded-full pl-[7px] pr-1 py-[2px] text-xs font-medium text-white/90">
                      4%
                      <Lucide
                        icon="ChevronUp"
                        className="w-4 h-4 ml-px stroke-[1.5]"
                      />
                    </div>
                  </div>
                  <div className="mt-1 text-base text-slate-500">
                    Площадь всех участков
                  </div>
                  <Menu className="absolute top-0 right-0 mt-5 mr-5">
                    <Menu.Button className="w-5 h-5 text-slate-500">
                      <Lucide
                        icon="MoreVertical"
                        className="w-6 h-6 stroke-slate-400/70 fill-slate-400/70"
                      />
                    </Menu.Button>
                    <Menu.Items className="w-40">
                      <Menu.Item href="#">
                        <Lucide icon="Copy" className="w-4 h-4 mr-2" /> Copy
                                                                        Link
                      </Menu.Item>
                      <Menu.Item href="#">
                        <Lucide icon="Trash" className="w-4 h-4 mr-2" />
                        Delete
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
                <div className="col-span-4 sm:col-span-2 xl:col-span-1 flex-1 p-5 border relative rounded-[0.6rem] bg-slate-50/50 overflow-hidden dark:bg-darkmode-400">
                  <div className="flex items-center justify-center w-12 h-12 border rounded-full border-primary/10 bg-primary/10">
                    <Lucide
                      icon="PanelsTopLeft"
                      className="w-6 h-6 text-primary fill-primary/10"
                    />
                  </div>
                  <div className="flex items-center mt-12">
                    <div className="text-2xl font-medium">273,235</div>
                    <div className="flex items-center ml-3.5 border border-success/50 bg-success/70 rounded-full pl-[7px] pr-1 py-[2px] text-xs font-medium text-white/90">
                      9%
                      <Lucide
                        icon="ChevronUp"
                        className="w-4 h-4 ml-px stroke-[1.5]"
                      />
                    </div>
                  </div>
                  <div className="mt-1 text-base text-slate-500">
                    Общий долг садоводов
                  </div>
                  <Menu className="absolute top-0 right-0 mt-5 mr-5">
                    <Menu.Button className="w-5 h-5 text-slate-500">
                      <Lucide
                        icon="MoreVertical"
                        className="w-6 h-6 stroke-slate-400/70 fill-slate-400/70"
                      />
                    </Menu.Button>
                    <Menu.Items className="w-40">
                      <Menu.Item href="#">
                        <Lucide icon="Copy" className="w-4 h-4 mr-2" /> Copy
                                                                        Link
                      </Menu.Item>
                      <Menu.Item href="#">
                        <Lucide icon="Trash" className="w-4 h-4 mr-2" />
                        Delete
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
              </div>
              <a
                href=""
                className="bg-slate-50 xl:w-20 text-slate-400/80 flex flex-col justify-center items-center p-5 border border-slate-300/80 rounded-[0.6rem] hover:bg-slate-50 border-dashed [&:hover_svg]:rotate-180 dark:bg-darkmode-400"
              >
                <Lucide
                  icon="PlusSquare"
                  className="w-6 h-6 transition-transform transform"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
