import { Head, Link, useForm } from "@inertiajs/react";
import { FormCheck, FormInput, FormLabel } from "@/Components/Base/Form";
import {FormEventHandler, useEffect} from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import Button from "@/Components/Base/Button";
import Alert from "@/Components/Base/Alert";
import Lucide from "@/Components/Base/Lucide";
import clsx from "clsx";
import {useIMask} from "react-imask";

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        phone: '',
        password: '',
        remember: true,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <AuthLayout>
            <Head title="Log in" />
            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <div className="mt-10">
                <div className="text-2xl font-medium">Вход</div>
                <div className="mt-2.5 text-slate-600">
                    Нет аккаунта?{" "}
                    <Link className="font-medium text-primary"
                          href={route('register')}>
                        Регистрация
                    </Link>
                </div>
                <Alert
                    variant="outline-primary"
                    className="flex items-center px-4 py-3 my-7 bg-primary/5 border-primary/20 rounded-[0.6rem] leading-[1.7]"
                >
                    {({dismiss}) => (
                        <>
                            <div className="">
                                <Lucide
                                    icon="Lightbulb"
                                    className="stroke-[0.8] w-7 h-7 mr-2 fill-primary/10"
                                />
                            </div>
                            <div className="ml-1 mr-8">
                                Добро пожаловать в <span className="font-medium">Gardens</span>!{" "}
                                Исследуйте возможности управления вашим садоводством – просто нажмите{" "}
                                <span className="font-medium">Войти</span> и начните ваше путешествие.
                            </div>
                            <Alert.DismissButton
                              type="button"
                              className="btn-close text-primary"
                              onClick={dismiss}
                              aria-label="Close"
                            >
                                <Lucide icon="X"
                                        className="w-5 h-5" />
                            </Alert.DismissButton>
                        </>
                    )}
                </Alert>
                <form onSubmit={submit}>
                    <div className="mt-6">
                        <FormLabel htmlFor="phone">Телефон*</FormLabel>
                        <FormInput
                            id="phone"
                            type="phone"
                            name="phone"
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
                        <FormLabel htmlFor="password" className="mt-4">Пароль*</FormLabel>
                        <FormInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className={clsx("block", "px-4", "py-3.5", "rounded-[0.6rem]", "border-slate-300/80", {
                                "border-danger": errors.password,
                            })}
                            placeholder="************"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && (
                            <div className="mt-2 text-danger">
                                {errors.password}
                            </div>
                        )}
                        <div className="flex mt-4 text-xs text-slate-500 sm:text-sm">
                            <div className="flex items-center mr-auto">
                                <FormCheck.Input
                                    id="remember-me"
                                    type="checkbox"
                                    className="mr-2.5 border"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <label
                                    className="cursor-pointer select-none"
                                    htmlFor="remember-me"
                                >
                                    Запомнить
                                </label>
                            </div>
                            <a href="">Потеряли пароль?</a>
                        </div>
                        <div className="mt-5 text-center xl:mt-8 xl:text-left">
                            <Button
                                variant="primary"
                                rounded
                                className="bg-gradient-to-r from-theme-1/70 to-theme-2/70 w-full py-3.5 xl:mr-3"
                                disabled={processing}
                            >
                                Войти
                            </Button>
                            <Button
                                variant="outline-secondary"
                                rounded
                                className="bg-white/70 w-full py-3.5 mt-3"
                                as={Link}
                                href={route('register')}
                            >
                                Зарегистрироваться
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

        </AuthLayout>
);
}
