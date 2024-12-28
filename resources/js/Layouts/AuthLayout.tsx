import { PropsWithChildren } from 'react';
import Tippy from "@/Components/Base/Tippy";
import clsx from "clsx";

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <>
            <div className="container grid lg:h-screen grid-cols-12 lg:max-w-[1550px] 2xl:max-w-[1750px] py-10 px-5 sm:py-14 sm:px-10 md:px-36 lg:py-0 lg:pl-14 lg:pr-12 xl:px-24">
                <div
                    className={clsx([
                        "relative z-50 h-full col-span-12 p-7 sm:p-14 bg-white rounded-2xl lg:bg-transparent lg:pr-10 lg:col-span-5 xl:pr-24 2xl:col-span-4 lg:p-0",
                        "before:content-[''] before:absolute before:inset-0 before:-mb-3.5 before:bg-white/40 before:rounded-2xl before:mx-5",
                    ])}
                >
                    <div className="relative z-10 flex flex-col justify-center w-full h-full py-2 lg:py-32">
                        <div className="rounded-[0.8rem] w-[55px] h-[55px] border border-primary/30 flex items-center justify-center">
                            <div className="relative flex items-center justify-center w-[50px] rounded-[0.6rem] h-[50px] bg-gradient-to-b from-theme-1/90 to-theme-2/90 bg-white">
                                <div className="w-[26px] h-[26px] relative -rotate-45 [&_div]:bg-white">
                                    <div className="absolute w-[20%] left-0 inset-y-0 my-auto rounded-full opacity-50 h-[75%]"></div>
                                    <div className="absolute w-[20%] inset-0 m-auto h-[120%] rounded-full"></div>
                                    <div className="absolute w-[20%] right-0 inset-y-0 my-auto rounded-full opacity-50 h-[75%]"></div>
                                </div>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
            <div className="fixed container grid w-screen inset-0 h-screen grid-cols-12 lg:max-w-[1550px] 2xl:max-w-[1750px] pl-14 pr-12 xl:px-24">
                <div
                    className={clsx([
                        "relative h-screen col-span-12 lg:col-span-5 2xl:col-span-4 z-20",
                        "after:bg-white after:hidden after:lg:block after:content-[''] after:absolute after:right-0 after:inset-y-0 after:bg-gradient-to-b after:from-white after:to-slate-100/80 after:w-[800%] after:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0]",
                        "before:content-[''] before:hidden before:lg:block before:absolute before:right-0 before:inset-y-0 before:my-6 before:bg-gradient-to-b before:from-white/10 before:to-slate-50/10 before:bg-white/50 before:w-[800%] before:-mr-4 before:rounded-[0_1.2rem_1.2rem_0/0_1.7rem_1.7rem_0]",
                    ])}
                ></div>
                <div
                    className={clsx([
                        "h-full col-span-7 2xl:col-span-8 lg:relative",
                        "before:content-[''] before:absolute before:lg:-ml-10 before:left-0 before:inset-y-0 before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:w-screen before:lg:w-[800%]",
                        "after:content-[''] after:absolute after:inset-y-0 after:left-0 after:w-screen after:lg:w-[800%] after:bg-texture-white after:bg-fixed after:bg-center after:lg:bg-[25rem_-25rem] after:bg-no-repeat",
                    ])}
                >
                    <div className="sticky top-0 z-10 flex-col justify-center hidden h-screen ml-16 lg:flex xl:ml-28 2xl:ml-36">
                        <div className="leading-[1.4] text-[2.6rem] xl:text-5xl font-medium xl:leading-[1.2] text-white">
                            Испытайте совершенство в управлении садоводством
                        </div>
                        <div className="mt-5 text-base leading-relaxed xl:text-lg text-white/70">
                            Раскройте полный потенциал Garders, где садовые товарищества процветают благодаря нашим тщательно разработанным, удобным инструментам управления. Присоединяйтесь к нам сегодня и формируйте будущее вашего садового сообщества уже сейчас.
                        </div>
                        <div className="flex flex-col gap-3 mt-10 xl:items-center xl:flex-row">
                            <div className="flex items-center">
                                <div className="w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                                    <Tippy
                                        as="img"
                                        alt="Tailwise - Admin Dashboard Template"
                                        className="rounded-full border-[3px] border-white/50"
                                        src=""
                                        content="Teset"
                                    />
                                </div>
                                <div className="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                                    <Tippy
                                        as="img"
                                        alt="Tailwise - Admin Dashboard Template"
                                        className="rounded-full border-[3px] border-white/50"
                                        src=""
                                        content="Teset"
                                    />
                                </div>
                                <div className="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                                    <Tippy
                                        as="img"
                                        alt="Tailwise - Admin Dashboard Template"
                                        className="rounded-full border-[3px] border-white/50"
                                        src=""
                                        content="Teset"
                                    />
                                </div>
                                <div className="-ml-3 w-9 h-9 2xl:w-11 2xl:h-11 image-fit zoom-in">
                                    <Tippy
                                        as="img"
                                        alt="Tailwise - Admin Dashboard Template"
                                        className="rounded-full border-[3px] border-white/50"
                                        src=""
                                        content="Teset"
                                    />
                                </div>
                            </div>
                            <div className="text-base xl:ml-2 2xl:ml-3 text-white/70">
                                Более 7 тысяч садоводств и это только начало! Ваше путешествие начинается здесь.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
