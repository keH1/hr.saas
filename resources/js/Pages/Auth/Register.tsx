import {FormEventHandler, useEffect} from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import {Head, useForm} from '@inertiajs/react';

import {FormCheck, FormInput, FormLabel} from "@/Components/Base/Form";
import Button from "@/Components/Base/Button";
import clsx from "clsx";
import LoadingIcon from "@/Components/Base/LoadingIcon";
import {useIMask} from 'react-imask';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        tenant_name: '',
        name: '',
        phone: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const { ref: phoneRef } = useIMask<HTMLInputElement>(
      {
        mask: '+7 (000) 000-00-00',
        lazy: true,
      },
      {
          onAccept: (value) => {
              setData('phone', value);
          },
      }
    );

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            preserveScroll: true,
        });
    };

    return (
        <AuthLayout>
            <Head title="Регистрация садоводства" />

            <form onSubmit={submit}>
                <div className="mt-10">
                    <div className="text-2xl font-medium">Регистрация</div>
                    <div className="mt-2.5 text-slate-600">
                        Ранее уже зарегистрировали садоводство?{" "}
                        <a className="font-medium text-primary"
                           href={route('login')}>
                            Вход
                        </a>
                    </div>
                    <div className="mt-6">
                        <FormLabel htmlFor="tenant_name">Название вашего СНТ*</FormLabel>
                        <FormInput
                          id="tenant_name"
                          name="tenant_name"
                          type="text"
                          value={data.tenant_name}
                          className={clsx("block", "px-4", "py-3.5", "rounded-[0.6rem]", "border-slate-300/80", {
                              "border-danger": errors.tenant_name,
                          })}
                          autoComplete="name"
                          onChange={(e) => setData('tenant_name', e.target.value)}
                        />
                        {errors.tenant_name && (
                          <div className="mt-2 text-danger">
                              {errors.tenant_name}
                          </div>
                        )}
                        <FormLabel htmlFor="name"
                                   className="mt-5">Ваше имя*</FormLabel>
                        <FormInput
                          id="name"
                          name="name"
                          type="text"
                          value={data.name}
                          className={clsx("block", "px-4", "py-3.5", "rounded-[0.6rem]", "border-slate-300/80", {
                              "border-danger": errors.name,
                          })}
                          autoComplete="name"
                          onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                          <div className="mt-2 text-danger">
                              {errors.name}
                          </div>
                        )}
                        <FormLabel htmlFor="phone"
                                   className="mt-5">Телефон*</FormLabel>
                        <FormInput
                          id="phone"
                          name="phone"
                          type="text"
                          inputMode="tel"
                          className={clsx("block", "px-4", "py-3.5", "rounded-[0.6rem]", "border-slate-300/80", {
                              "border-danger": errors.phone,
                          })}
                          ref={phoneRef}
                        />
                        {errors.phone && (
                          <div className="mt-2 text-danger">
                              {errors.phone}
                          </div>
                        )}
                        <FormLabel htmlFor="email"
                                   className="mt-5">Email*</FormLabel>
                        <FormInput
                          id="email"
                          type="email"
                          name="email"
                          value={data.email}
                          className={clsx("block", "px-4", "py-3.5", "rounded-[0.6rem]", "border-slate-300/80", {
                              "border-danger": errors.email,
                          })}
                          autoComplete="email"
                          onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && (
                          <div className="mt-2 text-danger">
                              {errors.email}
                          </div>
                        )}
                        <FormLabel htmlFor="password"
                                   className="mt-5">Пароль*</FormLabel>
                        <FormInput
                          id="password"
                          type="password"
                          name="password"
                          value={data.password}
                          className={clsx("block", "px-4", "py-3.5", "rounded-[0.6rem]", "border-slate-300/80", {
                              "border-danger": errors.password,
                          })}
                          placeholder="************"
                          autoComplete="new-password"
                          onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && (
                          <div className="mt-2 text-danger">
                              {errors.password}
                          </div>
                        )}
                        <FormLabel htmlFor="password_confirmation"
                                   className="mt-5">Подтверждение пароля*</FormLabel>
                        <FormInput
                          id="password_confirmation"
                          type="password"
                          name="password_confirmation"
                          value={data.password_confirmation}
                          className={clsx("block", "px-4", "py-3.5", "rounded-[0.6rem]", "border-slate-300/80", {
                              "border-danger": errors.password,
                          })}
                          placeholder="************"
                          autoComplete="new-password"
                          onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        {errors.password && (
                          <div className="mt-2 text-danger">
                              {errors.password}
                          </div>
                        )}
                        <div className="flex items-center mt-5 text-xs text-slate-500 sm:text-sm">
                            <FormCheck.Input
                              id="remember-me"
                              type="checkbox"
                              className="mr-2 border"
                            />
                            <label
                              className="cursor-pointer select-none"
                              htmlFor="remember-me"
                            >
                                Я согласен с
                            </label>
                            <a className="ml-1 text-primary dark:text-slate-200"
                               href="">
                                Обработкой персональных данных
                            </a>
                            .
                        </div>
                        <div className="mt-5 text-center xl:mt-8 xl:text-left">
                            <Button
                              variant="primary"
                              rounded
                              className="bg-gradient-to-r from-theme-1/70 to-theme-2/70 w-full py-3.5 xl:mr-3"
                              disabled={processing}
                            >
                                {processing && (
                                  <LoadingIcon color="#ffffff"
                                               icon="oval"
                                               className="w-5 h-5 mr-3" />
                                )}
                                Зарегистрироваться
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
