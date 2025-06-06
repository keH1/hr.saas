import AppLayout from "@/Layouts/Tenant/AppLayout";
import {Head, router, usePage} from '@inertiajs/react';
import {Page} from '@inertiajs/core';
import React, {useMemo, useState} from "react";

import Lucide from "@/Components/Base/Lucide";
import {
  FormCheck,
  FormInput,
  FormSelect,
  FormSwitch,
  InputGroup,
  FormMaskedInput,
  FormErrorMessage
} from "@/Components/Base/Form";

import * as Yup from 'yup';
import {FieldArray, FormikValues, useFormikContext} from "formik";
import {Wizard, WizardStep} from "@/Components/Wizard";
import clsx from "clsx";
import {useIMask} from "react-imask";
import {ReactSelect} from "@/Components/ReactSelect";
import {PageProps} from "@/types";
import Litepicker from "@/Components/Base/Litepicker";
import {AddressSuggestions, FioSuggestions} from 'react-dadata';
import "@css/vendors/dadata.css";
import Button from "@/Components/Base/Button";
import {debounce, get} from "lodash";
import axios from "axios";
import ContactLabelsOptions = App.Data.Tenant.Frontend.SelectOptions.ContactLabelsOptions;
import PlotsOptions = App.Data.Tenant.Frontend.SelectOptions.PlotsOptions;
import {generateCryptoRandomString} from "@/Utils/helper";

interface AddProps {
  initialValues: FormikValues,
}

interface AddPageProps extends PageProps {
  contact_labels?: Record<number, ContactLabelsOptions>;
  plots?: Record<number, PlotsOptions>;
}

export default function Add({initialValues}: AddProps) {
  const phonesInitialData = {
    id: generateCryptoRandomString(2),
    phone: '',
    label: 'PRIMARY',
  }
  const plotsInitialData = {
    plot_number: '',
    street: '',
    cadastre_number: '',
    area: '',
  }

  initialValues = {
    // Step 1
    lastName: '',
    firstName: '',
    secondName: '',
    gender: '',
    registration_address: '',
    residence_address: '',
    mailing_address: '',
    is_member: true,
    membership_start_date: '',
    membership_end_date: '',
    is_same_with_residence: true,
    is_same_with_mailing: true,
    phones: [phonesInitialData],

    // Step 2
    plots: [plotsInitialData],
  };

  /**
   * Validation rules
   */
  const gardenerValidationSchema = Yup.object().shape({
    lastName: Yup.mixed().required('Фамилия обязательна'),
    firstName: Yup.mixed().required('Имя обязательно'),
    gender: Yup.string().required('Пол обязателен'),
    phones: Yup.array()
      .of(
        Yup.object().shape({
          phone: Yup.string().required('Телефон обязателен'),
        })
      )
      .min(1, 'Укажите хотя бы один телефон'),
    registration_address: Yup.mixed().required('Адрес регистрации обязателен'),
    residence_address: Yup.mixed().when(['is_same_with_residence'], {
      is: (is_same_with_residence: any) => !is_same_with_residence,
      then: (schema) =>
        schema.test(
          'residence-required',
          'Адрес проживания обязателен',
          (value) =>
            value &&
            typeof value === 'object' &&
            !!((value as any).value) &&
            String((value as any).value).trim().length > 0
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    mailing_address: Yup.mixed().when(['is_same_with_mailing'], {
      is: (is_same_with_mailing: any) => !is_same_with_mailing,
      then: (schema) =>
        schema.test(
          'mailing-required',
          'Почтовый адрес обязателен',
          (value) =>
            value &&
            typeof value === 'object' &&
            !!((value as any).value) &&
            String((value as any).value).trim().length > 0
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    is_member: Yup.boolean(),
    membership_start_date: Yup.string().required('Дата начала членства обязательна'),
    membership_end_date: Yup.string().when(['is_member'], {
      is: (is_member: any) => !is_member,
      then: (schema) =>
        schema.required('Дата завершения членства обязательна'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleFormSubmit = async (values: any) => {
    await new Promise(resolve => setTimeout(resolve, 1));
    console.log('Форма отправлена, значения:', values);

    /*router.post(route('plots.store'), values, {
      preserveScroll: true,
      preserveState: true,
    })*/
  }

  return (
    <AppLayout>
      <Head title="Добавлене садовода" />

      <Wizard initialValues={initialValues}
              onSubmit={handleFormSubmit}>
        <WizardStep name={'Информация о садоводе'}
                    /*validationSchema={gardenerValidationSchema}*/>
          <GardenerInfoStep phoneInitialData={phonesInitialData} />
        </WizardStep>
        <WizardStep name={'Информация о участке'}
          /*extraActions={(formik) => (
            <Button
              disabled={formik.isSubmitting}
              variant="outline-primary"
              className="w-full px-10 md:w-auto border-primary/50 ml-auto"
              type="button"
              onClick={() => {
                formik.setFieldValue('plots', [...formik.values.owners, ownerInitialData]);
              }}
            >
              <Lucide
                icon="UserPlus"
                className="stroke-[1.3] w-4 h-4 mr-2 -ml-2"
              />
              Добавить участок
            </Button>
          )}*/
          /*validationSchema={secondStepValidationSchema}*/>
          <GardenerInfo />
        </WizardStep>
      </Wizard>
    </AppLayout>
  );
}

function GardenerInfoStep(props: any) {
  const formik = useFormikContext<any>();
  const errors = usePage<AddPageProps>().props.errors;
  const dadataToken = usePage<AddPageProps>().props.dadataToken
  const contactLabels = Object.values(usePage<AddPageProps>().props.contact_labels || {});

  const getPhoneInitialData = () => {
    const data = props.phoneInitialData;
    data.id = generateCryptoRandomString(2);

    return data;
  };

  return (
    <>
      <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div className="text-left">
            <div className="flex items-center">
              <div className="font-medium">Полное имя</div>
              <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                Обязательное
              </div>
            </div>
            <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              Введите полное имя, как оно указано в официальном удостоверении личности или выписке ЕГРН.
            </div>
          </div>
        </label>
        <div className="flex-1 w-full mt-3 xl:mt-0">
          <div className="flex flex-col items-center md:flex-row">
            <FioSuggestions token={dadataToken}
                            value={formik.values.lastName}
                            inputProps={{
                              placeholder: "Фамилия",
                              className: clsx(
                                'react-dadata__input',
                                'md:!rounded-bl-md md:!rounded-r-none focus:z-10',
                                {
                                  '!border-danger': (formik.touched.lastName && formik.errors.lastName) || get(errors, `lastName.value`)
                                }
                              )
                            }}
                            onChange={inputValue => {
                              formik.setFieldValue(`lastName`, inputValue);
                              formik.setFieldValue(`gender`, inputValue?.data.gender)
                            }}
                            selectOnBlur={true}
                            filterParts={["SURNAME"]} />
            <FioSuggestions token={dadataToken}
                            value={formik.values.firstName}
                            inputProps={{
                              placeholder: "Имя",
                              className: clsx(
                                'react-dadata__input',
                                '!rounded-none focus:z-10',
                                {
                                  '!border-danger': (formik.touched.firstName && formik.errors.firstName) || get(errors, `firstName.value`)
                                }
                              )
                            }}
                            onChange={inputValue => {
                              formik.setFieldValue(`firstName`, inputValue);
                              formik.setFieldValue(`gender`, inputValue?.data.gender)
                            }}
                            selectOnBlur={true}
                            filterParts={["NAME"]} />
            <FioSuggestions token={dadataToken}
                            value={formik.values.secondName}
                            inputProps={{
                              placeholder: "Отчество",
                              className: clsx(
                                'react-dadata__input',
                                '!rounded-t-none md:!rounded-l-none md:!rounded-tr-md focus:z-10',
                                {
                                  '!border-danger': (formik.touched.secondName && formik.errors.secondName) || get(errors, `secondName.value`)
                                }
                              )
                            }}
                            onChange={inputValue => {
                              formik.setFieldValue(`secondName`, inputValue);
                              formik.setFieldValue(`gender`, inputValue?.data.gender)
                            }}
                            selectOnBlur={true}
                            filterParts={["PATRONYMIC"]} />
          </div>
          <FormErrorMessage
            fields={["lastName", "firstName", "secondName", "lastName.value", "firstName.value", "secondName.value"]}
            formik={formik}
            errors={errors} />
        </div>
      </div>
      <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div className="text-left">
            <div className="flex items-center">
              <div className="font-medium">Пол</div>
              <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                Обязательное
              </div>
            </div>
            <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              Выберите пол садовода. Эти данные понадобятся чтобы автоматически корректно в дальнейшем
              заполнять
              документы.
            </div>
          </div>
        </label>
        <div className="flex-1 w-full mt-3 xl:mt-0">
          <div className="flex flex-col items-center md:flex-row">
            <div className={clsx(
              "bg-white w-full px-3 py-2 border rounded-md shadow-sm border-slate-300/60" +
              " first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10",
              {
                "!border-danger": (formik.touched.gender && formik.errors.gender) || get(errors, `gender`)
              })}>
              <FormCheck>
                <FormCheck.Input
                  id={`gender-male`}
                  type="radio"
                  name={`gender`}
                  value="MALE"
                  onChange={(e) => {
                    formik.setFieldValue(`gender`, e.target.value)
                  }}
                  checked={formik.values.gender === 'MALE'}
                />
                <FormCheck.Label htmlFor={`gender-male`}>
                  Мужской
                </FormCheck.Label>
              </FormCheck>
            </div>
            <div className={clsx(
              "bg-white w-full px-3 py-2 border rounded-md shadow-sm border-slate-300/60" +
              " first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10",
              {
                "!border-danger": (formik.touched.gender && formik.errors.gender) || get(errors, `gender`)
              })}>
              <FormCheck>
                <FormCheck.Input
                  id={`gender-female`}
                  type="radio"
                  name={`gender`}
                  value="FEMALE"
                  onChange={(e) => {
                    formik.setFieldValue(`gender`, e.target.value)
                  }}
                  checked={formik.values.gender === 'FEMALE'}
                />
                <FormCheck.Label htmlFor={`gender-female`}>
                  Женский
                </FormCheck.Label>
              </FormCheck>
            </div>
          </div>
          <FormErrorMessage
            fields={["gender"]}
            formik={formik}
            errors={errors} />
        </div>
      </div>
      <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div className="text-left">
            <div className="flex items-center">
              <div className="font-medium">Email</div>
            </div>
            <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              Пожалуйста, укажите действительный адрес электронной почты, к которому у садовода есть
              доступ. Он необходим для отправки электронных документов
            </div>
          </div>
        </label>
        <div className="flex-1 w-full mt-3 xl:mt-0">
          <FormInput
            id={`email`}
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="ankle.vanya@mail.ru"
          />
        </div>
        <FormErrorMessage
          fields={["email"]}
          formik={formik}
          errors={errors} />
      </div>
      <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div className="text-left">
            <div className="flex items-center">
              <div className="font-medium">Телефон</div>
              <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                Обязательное
              </div>
            </div>
            <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              Пожалуйста, укажите действительный номер телефона, по которому мы можем с вами связаться,
              если это необходимо.
            </div>
          </div>
        </label>
        <div className="flex-1 w-full mt-3 xl:mt-0 md:flex-col">
          <FieldArray name="phones"
                      render={arrayHelpers => (
                        <>
                          {formik.values.phones.map((phone: any, index: number) => (
                            <div key={phone.id}>
                              <div className="flex flex-col items-center md:flex-row">
                                <FormMaskedInput
                                  id={`phone-${index}`}
                                  name={`phones[${index}].phone`}
                                  className={clsx(
                                    "first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none" +
                                    " [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10",
                                    {
                                      '!border-danger': (get(formik.touched, `phones[${index}].phone`) && get(formik.errors, `phones[${index}].phone`)) || get(errors, `phones.${index}.phone`)
                                    }
                                  )}
                                  placeholder="+7 (999) 999-99-99"
                                  value={formik.values.phones[index].phone}
                                  maskOptions={{
                                    mask: '+7 (000) 000-00-00',
                                    lazy: true,
                                    onComplete: (value) => {
                                      formik.setFieldValue(`phones[${index}].phone`, value)
                                    }
                                  }}
                                />
                                <FormSelect className="md:w-36 first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 focus:z-10"
                                            name={`phones[${index}].label`}
                                            onChange={formik.handleChange}
                                            value={formik.values.phones[index].label}
                                >
                                  {contactLabels.map((contactLabel, key) => (
                                    <option key={key}
                                            value={contactLabel.value}>{contactLabel.label}</option>
                                  ))}
                                </FormSelect>
                              </div>
                              {formik.values.phones[index].comment !== undefined && (
                                <div className="flex flex-col items-center md:flex-row">
                                  <FormInput
                                    id={`comment-${index}`}
                                    type="text"
                                    name={`phones[${index}].comment`}
                                    className="!mt-1.5"
                                    placeholder="Комментарий"
                                    value={formik.values.phones[index].comment}
                                    onChange={formik.handleChange}
                                  />
                                </div>
                              )}
                              <FormErrorMessage
                                fields={["phone", "label", "comment"]}
                                formik={formik}
                                errors={errors}
                                prefix={`phones[${index}].`} />
                              <div className="mt-3.5 flex flex-col md:flex-row md:justify-between items-center space-y-2 md:space-y-0">
                                {/* Левая группа – кнопка "Еще телефон" */}
                                <div>
                                  {formik.values.phones.length - 1 === index && (
                                    <button className="flex items-center font-medium text-primary"
                                            type="button"
                                            onClick={() => arrayHelpers.push(getPhoneInitialData())}>
                                      <Lucide className="w-4 h-4 -mb-0.5 stroke-[1.3] mr-1"
                                              icon="Plus" />
                                      Еще телефон
                                    </button>
                                  )}
                                </div>
                                {/* Правая группа – кнопки "+ комментарий" и "Удалить телефон" */}
                                <div className="flex items-center space-x-2">
                                  {formik.values.phones[index].comment === undefined && (
                                    <button className="flex items-center font-medium text-primary"
                                            type="button"
                                            onClick={() => formik.setFieldValue(`phones[${index}].comment`, '')}>
                                      <Lucide className="w-4 h-4 -mb-0.5 stroke-[1.3] mr-1"
                                              icon="Plus" />
                                      Добавить комментарий
                                    </button>
                                  )}
                                  {formik.values.phones.length > 1 && (
                                    <button className="flex items-center font-medium text-danger"
                                            type="button"
                                            onClick={() => arrayHelpers.remove(index)}>
                                      <Lucide className="w-4 h-4 -mb-0.5 stroke-[1.3] mr-1"
                                              icon="Minus" />
                                      Удалить телефон
                                    </button>
                                  )}
                                </div>
                              </div>
                              {index < formik.values.phones.length - 1 && (
                                <hr className="my-5" />
                              )}
                            </div>
                          ))}
                        </>
                      )} />
        </div>
      </div>
      <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div className="text-left">
            <div className="flex items-center">
              <div className="font-medium">Адрес регистрации</div>
              <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                Обязательное
              </div>
            </div>
            <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              Адрес регистрации садовода, как он указан в официальном удостоверении личности или выписке
              ЕГРН.
            </div>
          </div>
        </label>
        <div className="flex-1 w-full mt-3 xl:mt-0">
          <AddressSuggestions token={dadataToken}
                              value={formik.values.registration_address}
                              inputProps={{
                                placeholder: "Введите адрес регистрации",
                                className: clsx(
                                  'react-dadata__input',
                                  {
                                    '!border-danger': (formik.touched.registration_address && formik.errors.registration_address) || get(errors, `registration_address.value`)
                                  }
                                )
                              }}
                              onChange={(suggestion) => {
                                if (suggestion) {
                                  const fullAddress = suggestion.unrestricted_value;
                                  const modifiedSuggestion = {
                                    ...suggestion,
                                    value: fullAddress,
                                  };

                                  formik.setFieldValue(`registration_address`, modifiedSuggestion);
                                }
                              }} />
          <div className="flex flex-col mt-3 sm:flex-row">
            <FormCheck className="mr-4">
              <FormCheck.Input id={`is_same_with_residence`}
                               name={`is_same_with_residence`}
                               type="checkbox"
                               value=""
                               checked={formik.values.is_same_with_residence}
                               onChange={(e) => {
                                 formik.setFieldValue(`is_same_with_residence`, e.target.checked)
                               }} />
              <FormCheck.Label htmlFor={`is_same_with_residence`}>
                Совпадает с адресом проживания
              </FormCheck.Label>
            </FormCheck>
            <FormCheck className="mt-2 mr-2 sm:mt-0">
              <FormCheck.Input id={`is_same_with_mailing`}
                               name={`is_same_with_mailing`}
                               type="checkbox"
                               value=""
                               checked={formik.values.is_same_with_mailing}
                               onChange={(e) => {
                                 formik.setFieldValue(`is_same_with_mailing`, e.target.checked)
                               }} />
              <FormCheck.Label htmlFor={`is_same_with_mailing`}>
                Использовать как почтовый адрес
              </FormCheck.Label>
            </FormCheck>
          </div>
          <FormErrorMessage
            fields={["registration_address", "registration_address.value"]}
            formik={formik}
            errors={errors} />
        </div>
      </div>
      {!formik.values.is_same_with_residence && (
        <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
          <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
            <div className="text-left">
              <div className="flex items-center">
                <div className="font-medium">Адрес проживания</div>
                <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                  Обязательное
                </div>
              </div>
              <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
                Адрес фактического проживания садовода.
              </div>
            </div>
          </label>
          <div className="flex-1 w-full mt-3 xl:mt-0">
            <AddressSuggestions token={dadataToken}
                                value={formik.values.residence_address}
                                inputProps={{
                                  placeholder: "Введите адрес фактического проживания",
                                  className: clsx(
                                    'react-dadata__input',
                                    {
                                      '!border-danger': (formik.touched.residence_address && formik.errors.residence_address) || get(errors, `residence_address.value`)
                                    }
                                  )
                                }}
                                onChange={(suggestion) => {
                                  if (suggestion) {
                                    const fullAddress = suggestion.unrestricted_value;
                                    const modifiedSuggestion = {
                                      ...suggestion,
                                      value: fullAddress,
                                    };

                                    formik.setFieldValue(`residence_address`, modifiedSuggestion);
                                  }
                                }} />
            <FormErrorMessage
              fields={["residence_address", "residence_address.value"]}
              formik={formik}
              errors={errors} />
          </div>
        </div>
      )}
      {!formik.values.is_same_with_mailing && (
        <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
          <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
            <div className="text-left">
              <div className="flex items-center">
                <div className="font-medium">Почтовый адрес</div>
                <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                  Обязательное
                </div>
              </div>
              <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
                Адрес на который мы сможем отправлять корреспонденцию. Обычно совпадает с фактическим или
                адресом
                регистрации.
              </div>
            </div>
          </label>
          <div className="flex-1 w-full mt-3 xl:mt-0">
            <AddressSuggestions token={dadataToken}
                                value={formik.values.mailing_address}
                                inputProps={{
                                  placeholder: "Введите почтовый адрес",
                                  className: clsx(
                                    'react-dadata__input',
                                    {
                                      '!border-danger': (formik.touched.mailing_address && formik.errors.mailing_address) || get(errors, `mailing_address.value`)
                                    }
                                  )
                                }}
                                onChange={(suggestion) => {
                                  if (suggestion) {
                                    const fullAddress = suggestion.unrestricted_value;
                                    const modifiedSuggestion = {
                                      ...suggestion,
                                      value: fullAddress,
                                    };

                                    formik.setFieldValue(`mailing_address`, modifiedSuggestion);
                                  }
                                }} />
            <FormErrorMessage
              fields={["mailing_address", "mailing_address.value"]}
              formik={formik}
              errors={errors} />
          </div>
        </div>
      )}
      <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div className="text-left">
            <div className="flex items-center">
              <div className="font-medium">Член товарищества</div>
              <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                Обязательное
              </div>
            </div>
            <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              Является ли человек членом товарищества.
            </div>
          </div>
        </label>
        <div className="flex-1 w-full mt-3 xl:mt-0">
          <div className="flex flex-col items-center md:flex-row">
            <div className="bg-white px-3 py-2 first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10">
              <FormSwitch>
                <FormSwitch.Input id="is_member"
                                  name="is_member"
                                  type="checkbox"
                                  checked={formik.values.is_member}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      formik.setFieldValue("membership_end_date", '');
                                    }
                                    formik.setFieldValue(`is_member`, e.target.checked)
                                  }} />
              </FormSwitch>
            </div>
            {formik.values.is_member ? (
              <div className="flex-1 w-full mt-3 xl:mt-0">
                <Litepicker
                  id="membership_start_date"
                  name="membership_start_date"
                  value={formik.values.membership_start_date}
                  onChange={(e) => {
                    formik.setFieldValue(`membership_start_date`, e.target.value)
                  }}
                  placeholder="Укажите дату начала членства"
                  options={{
                    autoApply: true,
                    dropdowns: {
                      minYear: 1970,
                      maxYear: 2100,
                      months: true,
                      years: true,
                    },
                  }}
                  className={clsx({
                    "!border-danger": (formik.touched.membership_start_date && formik.errors.membership_start_date) || get(errors, `membership_start_date`)
                  })}
                />
              </div>
            ) : (
              <div className="flex-1 w-full mt-3 xl:mt-0">
                <div className="flex flex-col items-center md:flex-row">
                  <Litepicker
                    id="membership_start_date"
                    name="membership_start_date"
                    value={formik.values.membership_start_date}
                    onChange={(e) => {
                      formik.setFieldValue(`membership_start_date`, e.target.value)
                    }}
                    placeholder="Укажите дату начала членства"
                    options={{
                      autoApply: true,
                      dropdowns: {
                        minYear: 1970,
                        maxYear: 2100,
                        months: true,
                        years: true,
                      },
                    }}
                    className={clsx(
                      "first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none" +
                      " [&:not(:first-child):not(:last-child)]:-mt-px" +
                      " [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10",
                      {
                        "border-danger": (formik.touched.membership_start_date && formik.errors.membership_start_date) || get(errors, `membership_start_date`)
                      })}
                  />
                  <Litepicker
                    id="membership_end_date"
                    name="membership_end_date"
                    value={formik.values.membership_end_date}
                    onChange={(e) => {
                      formik.setFieldValue(`membership_end_date`, e.target.value)
                    }}
                    placeholder="Укажите дату завершения членства"
                    options={{
                      autoApply: true,
                      dropdowns: {
                        minYear: 1970,
                        maxYear: 2100,
                        months: true,
                        years: true,
                      },
                    }}
                    className={clsx(
                      "first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none" +
                      " [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10",
                      {
                        "border-danger": (formik.touched.membership_end_date && formik.errors.membership_end_date) || get(errors, `membership_end_date`)
                      })}
                  />
                </div>
              </div>
            )}
          </div>
          <FormErrorMessage
            fields={["membership_end_date", "membership_start_date"]}
            formik={formik}
            errors={errors} />
        </div>
      </div>
    </>
  );
}

function GardenerInfo() {
  const [isLoading, setLoading] = useState<boolean>(false)
  const dadataToken = usePage<AddPageProps>().props.dadataToken
  const plots = Object.values(usePage<AddPageProps>().props.plots || {});
  const errors = usePage<AddPageProps>().props.errors;
  const formik = useFormikContext<any>();

  const loadPlots = useMemo(() => debounce(
    (inputValue: string, callback: (options: any[]) => void) => {
      setLoading(true);
      axios.get(route("plots.options"), {params: {q: inputValue}})
        .then(response => callback(Object.values(response.data)))
        .catch(() => callback([]))
        .finally(() => setLoading(false));
    },
    500
  ), []);

  console.log(plots)

  // console.log('Values', formik.values);
  // console.log('Errors', formik.errors);
  // console.log('Touched', formik.touched);

  return (
    <div>
      dfdgsg
    </div>
  );
}
