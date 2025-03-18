import AppLayout from "@/Layouts/Tenant/AppLayout";
import {Head, router, usePage} from '@inertiajs/react';
import {Page} from '@inertiajs/core';
import React, {useMemo, useState} from "react";

import Lucide from "@/Components/Base/Lucide";
import {FormCheck, FormInput, FormSwitch, InputGroup} from "@/Components/Base/Form";

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
import StreetOptions = App.Data.Tenant.Frontend.SelectOptions.StreetOptions;
import GardenerOptions = App.Data.Tenant.Frontend.SelectOptions.GardenerOptions;

interface AddProps {
  initialValues: FormikValues,
}

interface AddPageProps extends PageProps {
  streets?: Record<number, StreetOptions>;
  gardeners?: Record<number, GardenerOptions>;
}

export default function Add({initialValues}: AddProps) {
  const ownerInitialData = {
    gardenerId: '',
    isNew: false,
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
    ownership_percentage: '',
  };

  initialValues = {
    // Step 1
    plot_number: '',
    street: '',
    cadastre_number: '',
    area: '',
    // Step 2
    owners: [ownerInitialData],
  };

  /**
   * Validation rules
   */
  const firstStepValidationSchema = Yup.object({
    plot_number: Yup.string().required('Обязательно для заполнения'),
    street: Yup.object({}).required('Обязательно для заполнения'),
    cadastre_number: Yup.string().required('Обязательно для заполнения'),
    area: Yup.string().required('Обязательно для заполнения'),
  });
  const ownerValidationSchema = Yup.object().shape({
    isNew: Yup.boolean(),
    gardenerId: Yup.mixed().when('isNew', {
      is: false,
      then: (schema) => schema.required('Выберите садовода'),
      otherwise: (schema) => schema.notRequired(),
    }),
    lastName: Yup.mixed().when('isNew', {
      is: true,
      then: (schema) =>
        schema.test(
          'lastName-required',
          'Фамилия обязательна',
          (value) =>
            value &&
            typeof value === 'object' &&
            !!((value as any).value) &&
            String((value as any).value).trim().length > 0
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    firstName: Yup.mixed().when('isNew', {
      is: true,
      then: (schema) =>
        schema.test(
          'firstName-required',
          'Имя обязательно',
          (value) =>
            value &&
            typeof value === 'object' &&
            !!((value as any).value) &&
            String((value as any).value).trim().length > 0
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    secondName: Yup.mixed().when('isNew', {
      is: true,
      then: (schema) =>
        schema.test(
          'secondName-required',
          'Отчество обязательно',
          (value) =>
            value &&
            typeof value === 'object' &&
            !!((value as any).value) &&
            String((value as any).value).trim().length > 0
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    gender: Yup.string().when('isNew', {
      is: true,
      then: (schema) => schema.required('Пол обязателен'),
      otherwise: (schema) => schema.notRequired(),
    }),
    registration_address: Yup.mixed().when('isNew', {
      is: true,
      then: (schema) =>
        schema.test(
          'registration-required',
          'Адрес регистрации обязателен',
          (value) =>
            value &&
            typeof value === 'object' &&
            !!((value as any).value) &&
            String((value as any).value).trim().length > 0
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    residence_address: Yup.mixed().when(['isNew', 'is_same_with_residence'], {
      is: (isNew: any, is_same_with_residence: any) => isNew && !is_same_with_residence,
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
    mailing_address: Yup.mixed().when(['isNew', 'is_same_with_mailing'], {
      is: (isNew: any, is_same_with_mailing: any) => isNew && !is_same_with_mailing,
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
    membership_start_date: Yup.string().when(['isNew'], {
      is: true,
      then: (schema) =>
        schema.required('Дата начала членства обязательна'),
      otherwise: schema => schema.notRequired()
    }),
    membership_end_date: Yup.string().when(['isNew', 'is_member'], {
      is: (isNew: any, is_member: any) => isNew && !is_member,
      then: (schema) =>
        schema.required('Дата завершения членства обязательна'),
      otherwise: (schema) => schema.notRequired(),
    }),
    ownership_percentage: Yup.number()
      .nullable()
      .min(0, 'Доля не может быть меньше 0')
      .max(100, 'Доля не может быть больше 100'),
  });
  const secondStepValidationSchema = Yup.object().shape({
    owners: Yup.array()
      .of(ownerValidationSchema)
      .min(1, 'Добавьте хотя бы одного владельца')
      .test(
        'ownership-percentage-required-if-multiple',
        'Доля садовода обязательна, если владельцев больше одного',
        function (owners) {
          if (!owners || owners.length <= 1) return true;
          const valid = owners.every(
            (owner) =>
              owner.ownership_percentage !== null &&
              String(owner.ownership_percentage).trim() !== ''
          );
          if (!valid) {
            return this.createError({
              path: 'owners_share',
              message: 'Доля садовода обязательна, если владельцев больше одного',
            });
          }
          return true;
        }
      )
      .test(
        'ownership-sum',
        'Суммарная доля не должна превышать 100%',
        function (owners) {
          if (!owners) return true;
          const sum = owners.reduce(
            (acc, owner) => acc + Number(owner.ownership_percentage || 0),
            0
          );
          if (sum > 100) {
            return this.createError({
              path: 'owners_share',
              message: 'Суммарная доля не должна превышать 100%',
            });
          }
          return true;
        }
      ),
  });

  const handleFormSubmit = async (values: any) => {
    await new Promise(resolve => setTimeout(resolve, 1));
    console.log('Форма отправлена, значения:', values);

    router.post(route('plots.store'), values, {
      preserveScroll: true,
      preserveState: true,
    })
  }

  return (
    <AppLayout>
      <Head title="Добавлене участка" />

      <Wizard initialValues={initialValues}
              onSubmit={handleFormSubmit}>
        <WizardStep name={'Информация о участке'}
                    /*validationSchema={firstStepValidationSchema}*/>
          <MainInfoStep />
        </WizardStep>
        <WizardStep name={'Информация о владельце'}
                    extraActions={(formik) => (
                      <Button
                        disabled={formik.isSubmitting}
                        variant="outline-primary"
                        className="w-full px-10 md:w-auto border-primary/50 ml-auto"
                        type="button"
                        onClick={() => {
                          formik.setFieldValue('owners', [...formik.values.owners, ownerInitialData]);
                        }}
                      >
                        <Lucide
                          icon="UserPlus"
                          className="stroke-[1.3] w-4 h-4 mr-2 -ml-2"
                        />
                        Добавить владельца
                      </Button>
                    )}
                    /*validationSchema={secondStepValidationSchema}*/>
          <GardenerInfo />
        </WizardStep>
      </Wizard>
    </AppLayout>
  );
}

function MainInfoStep() {
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormikContext<any>();
  const streets = Object.values(usePage<AddPageProps>().props.streets || {});
  const errors = usePage<AddPageProps>().props.errors;
  const {ref: cadastreNumberRef} = useIMask<HTMLInputElement>(
    {
      mask: '00:00:000000[0]:0[0000]',
      lazy: true,
    },
    {
      onAccept: (e) => formik.setFieldValue('cadastre_number', e),
    }
  );

  const handleCreateStreet = (inputValue: string) => {
    setIsLoading(true);
    router.post(route('streets.store'), {
      street: inputValue,
    }, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: (page: Page<AddPageProps>) => {
        const streets = page.props.streets;

        if (!streets) {
          console.error('Streets data is undefined');
          return;
        }

        const targetStreet = Object.values(streets).find((street) => street.label === inputValue);
        formik.setFieldValue('street', targetStreet);
      },
      onFinish: () => {
        setIsLoading(false);
      },
    })
  };

  return (
    <>
      <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div className="text-left">
            <div className="flex items-center">
              <div className="font-medium">Адрес участка</div>
              <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                Обязательное
              </div>
            </div>
            <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              Введите адрес участка в вашем СНТ, под адресом обычно понимают номер участка и название улицы в
              садоводстве. Если у вас в садоводстве нет названий улиц, просто введите номер участка.
            </div>
          </div>
        </label>
        <div className="flex-1 w-full mt-3 xl:mt-0">
          <div className="flex flex-col items-center md:flex-row">
            <FormInput
              id="plot_number"
              type="text"
              name="plot_number"
              className={clsx("first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10", {
                "border-danger [&:not(:first-child):not(:last-child)]:md:ml-0 last:md:ml-0": (formik.touched.plot_number && formik.errors.plot_number) || errors.plot_number,
              })}
              placeholder='Номер участка'
              onChange={formik.handleChange}
              value={formik.values.plot_number}
            />
            <ReactSelect id="street"
                         name="street"
                         options={streets}
                         componentType="creatable"
                         isClearable={true}
                         placeholder="Название улицы"
                         className={clsx("w-full")}
                         classNames={{
                           control: () => 'md:-ml-px md:rounded-l-none',
                         }}
                         onChange={(newValue: any) => formik.setFieldValue('street', newValue)}
                         onCreateOption={handleCreateStreet}
                         isDisabled={isLoading}
                         isLoading={isLoading}
                         value={formik.values.street}
                         hasError={!!((formik.touched.street && formik.errors.street) || errors.street)}
            />
          </div>
          {(() => {
            const fields = ["plot_number", "street"];
            const firstErrorField = fields.find((field) => formik.touched[field] && formik.errors[field] || errors[field]);

            if (firstErrorField) {
              const errorMessage = formik.errors[firstErrorField] ?? errors[firstErrorField];
              return (
                <div className="mt-2 text-danger">
                  {`${errorMessage}`}
                </div>
              );
            }

            return null;
          })()}
        </div>
      </div>
      <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div className="text-left">
            <div className="flex items-center">
              <div className="font-medium">Кадастровый номер</div>
              <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                Обязательное
              </div>
            </div>
            <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              Заполните сюда кадастровый номер участка. Обычно он указан в выписке из ЕГРН или вы можете найти участок
              на публичной кадастровой карте и узнать его кадастровый номер.
            </div>
          </div>
        </label>
        <div className="flex-1 w-full mt-3 xl:mt-0">
          <FormInput
            id="cadastre_number"
            type="text"
            name="cadastre_number"
            className={clsx({
              "border-danger": (formik.touched.cadastre_number && formik.errors.cadastre_number) || errors.cadastre_number,
            })}
            value={formik.values.cadastre_number}
            onChange={formik.handleChange}
            placeholder="00:00:0000000:000"
            ref={cadastreNumberRef}
          />
          {((formik.touched.cadastre_number && formik.errors.cadastre_number) || errors.cadastre_number) && (
            <div className="mt-2 text-danger">
              {formik.errors.cadastre_number && (`${formik.errors.cadastre_number}`)}
              {errors.cadastre_number && (`${errors.cadastre_number}`)}
            </div>
          )}
        </div>
      </div>
      <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
          <div className="text-left">
            <div className="flex items-center">
              <div className="font-medium">Площадь</div>
              <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                Обязательное
              </div>
            </div>
            <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
              Укажите площадь участка. Она указана в выписке из ЕГРН а так же в публичной кадастровой карте.
            </div>
          </div>
        </label>
        <div className="flex-1 w-full mt-3 xl:mt-0">
          <InputGroup className="mt-2">
            <FormInput
              id="area"
              type="number"
              name="area"
              className={clsx({
                "border-danger": (formik.touched.area && formik.errors.area) || errors.area,
              })}
              value={formik.values.area}
              onChange={formik.handleChange}
              placeholder="100"
              aria-label="Площадь"
              aria-describedby="input-group-area"
            />
            <InputGroup.Text id="input-group-area">
              м²
            </InputGroup.Text>
          </InputGroup>
          {((formik.touched.area && formik.errors.area) || errors.area) && (
            <div className="mt-2 text-danger">
              {formik.errors.area && (`${formik.errors.area}`)}
              {errors.area && (`${errors.area}`)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function GardenerInfo() {
  const [isLoading, setLoading] = useState<boolean>(false)
  const dadataToken = usePage<AddPageProps>().props.dadataToken
  const gardeners = Object.values(usePage<AddPageProps>().props.gardeners || {});
  const errors = usePage<AddPageProps>().props.errors;
  const formik = useFormikContext<any>();

  const loadGardeners = useMemo(() => debounce(
    (inputValue: string, callback: (options: any[]) => void) => {
      setLoading(true);
      axios.get(route("gardeners.options"), {params: {q: inputValue}})
        .then(response => callback(Object.values(response.data)))
        .catch(() => callback([]))
        .finally(() => setLoading(false));
    },
    500
  ), []);
  // console.log('Values', formik.values);
  // console.log('Errors', formik.errors);
  // console.log('Touched', formik.touched);

  return (
    <FieldArray name="owners">
      {({remove}) => (
        <>
          {formik.values.owners.map((owner: any, index: number) => (
            <div key={index}
                 className="owner_block">
              {!owner.isNew ? (
                <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                  <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Садовод</div>
                        <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                          Обязательное
                        </div>
                      </div>
                      <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
                        Выберите садовода который владеет данным участком. Просто начните вводить его ФИО. Если него нет
                        в системе, то вам предложат создать нового.
                      </div>
                    </div>
                  </label>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <div className="flex flex-col items-center md:flex-row">
                      <ReactSelect componentType="async_creatable"
                                   id={`owners[${index}].gardenerId`}
                                   name={`owners[${index}].gardenerId`}
                                   defaultOptions={gardeners}
                                   isClearable={true}
                                   placeholder="Введите ФИО садовода"
                                   className={clsx("w-full")}
                                   onChange={(newValue: any) => formik.setFieldValue(`owners[${index}].gardenerId`, newValue)}
                                   onCreateOption={() => {
                                     formik.setFieldValue(`owners[${index}].isNew`, true);
                                   }}
                                   loadOptions={loadGardeners}
                                   isLoading={isLoading}
                                   value={formik.values.owners[index].gardenerId}
                                   hasError={!!(
                                     (get(formik.touched, `owners[${index}].gardenerId`) &&
                                     get(formik.errors, `owners[${index}].gardenerId`)) || get(errors, `owners.${index}.gardenerId`)
                                   )}
                      />
                    </div>
                    {((get(formik.touched, `owners[${index}].gardenerId`) && get(formik.errors, `owners[${index}].gardenerId`)) || get(errors, `owners.${index}.gardenerId`)) && (
                      <div className="mt-2 text-danger">
                        {get(formik.errors, `owners[${index}].gardenerId`) && (`${get(formik.errors, `owners[${index}].gardenerId`)}`)}
                        {get(errors, `owners.${index}.gardenerId`) && (`${get(errors, `owners.${index}.gardenerId`)}`)}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
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
                                        value={formik.values.owners[index].lastName}
                                        inputProps={{
                                          placeholder: "Фамилия",
                                          className: clsx(
                                            'react-dadata__input',
                                            'md:!rounded-bl-md md:!rounded-r-none focus:z-10',
                                            {
                                              '!border-danger': (get(formik.touched, `owners[${index}].lastName`) && get(formik.errors, `owners[${index}].lastName`)) || get(errors, `owners.${index}.lastName.value`)
                                            }
                                          )
                                        }}
                                        onChange={inputValue => {
                                          formik.setFieldValue(`owners[${index}].lastName`, inputValue);
                                          formik.setFieldValue(`owners[${index}].gender`, inputValue?.data.gender)
                                        }}
                                        filterParts={["SURNAME"]} />
                        <FioSuggestions token={dadataToken}
                                        value={formik.values.owners[index].firstName}
                                        inputProps={{
                                          placeholder: "Имя",
                                          className: clsx(
                                            'react-dadata__input',
                                            '!rounded-none focus:z-10',
                                            {
                                              '!border-danger': (get(formik.touched, `owners[${index}].firstName`) && get(formik.errors, `owners[${index}].firstName`)) || get(errors, `owners.${index}.firstName.value`)
                                            }
                                          )
                                        }}
                                        onChange={inputValue => {
                                          formik.setFieldValue(`owners[${index}].firstName`, inputValue);
                                          formik.setFieldValue(`owners[${index}].gender`, inputValue?.data.gender)
                                        }}
                                        filterParts={["NAME"]} />
                        <FioSuggestions token={dadataToken}
                                        value={formik.values.owners[index].secondName}
                                        inputProps={{
                                          placeholder: "Отчество",
                                          className: clsx(
                                            'react-dadata__input',
                                            '!rounded-t-none md:!rounded-l-none md:!rounded-tr-md focus:z-10',
                                            {
                                              '!border-danger': (get(formik.touched, `owners[${index}].secondName`) && get(formik.errors, `owners[${index}].secondName`)) || get(errors, `owners.${index}.secondName.value`)
                                            }
                                          )
                                        }}
                                        onChange={inputValue => {
                                          formik.setFieldValue(`owners[${index}].secondName`, inputValue);
                                          formik.setFieldValue(`owners[${index}].gender`, inputValue?.data.gender)
                                        }}
                                        filterParts={["PATRONYMIC"]} />
                      </div>
                      {(() => {
                        const fields = ["lastName", "firstName", "secondName", "lastName.value", "firstName.value", "secondName.value"];
                        const firstErrorField = fields.find((field) => (get(formik.touched, `owners[${index}].${field}`) && get(formik.errors, `owners[${index}].${field}`) || get(errors, `owners.${index}.${field}`)));

                        if (firstErrorField) {
                          const errorMessage = formik.errors[firstErrorField] ?? get(errors, `owners.${index}.${firstErrorField}`);
                          return (
                            <div className="mt-2 text-danger">
                              {`${errorMessage}`}
                            </div>
                          );
                        }

                        return null;
                      })()}
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
                            "!border-danger": (get(formik.touched, `owners[${index}].gender`) && get(formik.errors, `owners[${index}].gender`)) || get(errors, `owners.${index}.gender`)
                          })}>
                          <FormCheck>
                            <FormCheck.Input
                              id={`gender-${index}-male`}
                              type="radio"
                              name={`owners[${index}].gender`}
                              value="MALE"
                              onChange={(e) => {
                                formik.setFieldValue(`owners[${index}].gender`, e.target.value)
                              }}
                              checked={formik.values.owners[index].gender === 'MALE'}
                            />
                            <FormCheck.Label htmlFor={`gender-${index}-male`}>
                              Мужской
                            </FormCheck.Label>
                          </FormCheck>
                        </div>
                        <div className={clsx(
                          "bg-white w-full px-3 py-2 border rounded-md shadow-sm border-slate-300/60" +
                          " first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10",
                          {
                            "!border-danger": (get(formik.touched, `owners[${index}].gender`) && get(formik.errors, `owners[${index}].gender`)) || get(errors, `owners.${index}.gender`)
                          })}>
                          <FormCheck>
                            <FormCheck.Input
                              id={`gender-${index}-male`}
                              type="radio"
                              name={`owners[${index}].gender`}
                              value="FEMALE"
                              onChange={(e) => {
                                formik.setFieldValue(`owners[${index}].gender`, e.target.value)
                              }}
                              checked={formik.values.owners[index].gender === 'FEMALE'}
                            />
                            <FormCheck.Label htmlFor={`gender-${index}-female`}>
                              Женский
                            </FormCheck.Label>
                          </FormCheck>
                        </div>
                      </div>
                      {((get(formik.touched, `owners[${index}].gender`) && get(formik.errors, `owners[${index}].gender`) || get(errors, `owners.${index}.gender`))) && (
                        <div className="mt-2 text-danger">
                          {get(formik.errors, `owners[${index}].gender`) && (`${get(formik.errors, `owners[${index}].gender`)}`)}
                          {get(errors, `owners.${index}.gender`) && (`${get(errors, `owners.${index}.gender`)}`)}
                        </div>
                      )}
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
                                          value={formik.values.owners[index].registration_address}
                                          inputProps={{
                                            placeholder: "Введите адрес регистрации",
                                            className: clsx(
                                              'react-dadata__input',
                                              {
                                                '!border-danger': (get(formik.touched, `owners[${index}].registration_address`) && get(formik.errors, `owners[${index}].registration_address`)) || get(errors, `owners.${index}.registration_address.value`)
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

                                              formik.setFieldValue(`owners[${index}].registration_address`, modifiedSuggestion);
                                            }
                                          }} />
                      <div className="flex flex-col mt-3 sm:flex-row">
                        <FormCheck className="mr-4">
                          <FormCheck.Input id={`is_same_with_residence[${index}]`}
                                           name={`owners[${index}].is_same_with_residence`}
                                           type="checkbox"
                                           value=""
                                           checked={formik.values.owners[index].is_same_with_residence}
                                           onChange={(e) => {
                                             formik.setFieldValue(`owners[${index}].is_same_with_residence`, e.target.checked)
                                           }} />
                          <FormCheck.Label htmlFor={`is_same_with_residence[${index}]`}>
                            Совпадает с адресом проживания
                          </FormCheck.Label>
                        </FormCheck>
                        <FormCheck className="mt-2 mr-2 sm:mt-0">
                          <FormCheck.Input id={`is_same_with_mailing[${index}]`}
                                           name={`owners[${index}].is_same_with_mailing`}
                                           type="checkbox"
                                           value=""
                                           checked={formik.values.owners[index].is_same_with_mailing}
                                           onChange={(e) => {
                                             formik.setFieldValue(`owners[${index}].is_same_with_mailing`, e.target.checked)
                                           }} />
                          <FormCheck.Label htmlFor={`is_same_with_mailing[${index}]`}>
                            Использовать как почтовый адрес
                          </FormCheck.Label>
                        </FormCheck>
                      </div>
                      {((get(formik.touched, `owners[${index}].registration_address`) && get(formik.errors, `owners[${index}].registration_address`) || get(errors, `owners.${index}.registration_address.value`))) && (
                        <div className="mt-2 text-danger">
                          {get(formik.errors, `owners[${index}].registration_address`) && (`${get(formik.errors, `owners[${index}].registration_address`)}`)}
                          {get(errors, `owners.${index}.registration_address.value`) && (`${get(errors, `owners.${index}.registration_address.value`)}`)}
                        </div>
                      )}
                    </div>
                  </div>
                  {!formik.values.owners[index].is_same_with_residence && (
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
                                            value={formik.values.owners[index].residence_address}
                                            inputProps={{
                                              placeholder: "Введите адрес фактического проживания",
                                              className: clsx(
                                                'react-dadata__input',
                                                {
                                                  '!border-danger': (get(formik.touched, `owners[${index}].residence_address`) && get(formik.errors, `owners[${index}].residence_address`)) || get(errors, `owners.${index}.residence_address.value`)
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

                                                formik.setFieldValue(`owners[${index}].residence_address`, modifiedSuggestion);
                                              }
                                            }} />
                        {((get(formik.touched, `owners[${index}].residence_address`) && get(formik.errors, `owners[${index}].residence_address`) || get(errors, `owners.${index}.residence_address.value`))) && (
                          <div className="mt-2 text-danger">
                            {get(formik.errors, `owners[${index}].residence_address`) && (`${get(formik.errors, `owners[${index}].residence_address`)}`)}
                            {get(errors, `owners.${index}.residence_address.value`) && (`${get(errors, `owners.${index}.residence_address.value`)}`)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {!formik.values.owners[index].is_same_with_mailing && (
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
                                            value={formik.values.owners[index].mailing_address}
                                            inputProps={{
                                              placeholder: "Введите почтовый адрес",
                                              className: clsx(
                                                'react-dadata__input',
                                                {
                                                  '!border-danger': (get(formik.touched, `owners[${index}].mailing_address`) && get(formik.errors, `owners[${index}].mailing_address`)) || get(errors, `owners.${index}.mailing_address.value`)
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

                                                formik.setFieldValue(`owners[${index}].mailing_address`, modifiedSuggestion);
                                              }
                                            }} />
                        {((get(formik.touched, `owners[${index}].mailing_address`) && get(formik.errors, `owners[${index}].mailing_address`) || get(errors, `owners.${index}.mailing_address.value`))) && (
                          <div className="mt-2 text-danger">
                            {get(formik.errors, `owners[${index}].mailing_address`) && (`${get(formik.errors, `owners[${index}].mailing_address`)}`)}
                            {get(errors, `owners.${index}.mailing_address.value`) && (`${get(errors, `owners.${index}.mailing_address.value`)}`)}
                          </div>
                        )}
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
                                              checked={formik.values.owners[index].is_member}
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  formik.setFieldValue("membership_end_date", '');
                                                }
                                                formik.setFieldValue(`owners[${index}].is_member`, e.target.checked)
                                              }} />
                          </FormSwitch>
                        </div>
                        {formik.values.owners[index].is_member ? (
                          <div className="flex-1 w-full mt-3 xl:mt-0">
                            <Litepicker
                              id="membership_start_date"
                              name="membership_start_date"
                              value={formik.values.owners[index].membership_start_date}
                              onChange={(e) => {
                                formik.setFieldValue(`owners[${index}].membership_start_date`, e.target.value)
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
                                "!border-danger": (get(formik.touched, `owners[${index}].membership_start_date`) && get(formik.errors, `owners[${index}].membership_start_date`)) || get(errors, `owners.${index}.membership_start_date`)
                              })}
                            />
                            {get(formik.touched, `owners[${index}].membership_start_date`) && get(formik.errors, `owners[${index}].membership_start_date`) && (
                              <div className="mt-2 text-danger">
                                {`${get(formik.errors, `owners[${index}].membership_start_date`)}`}
                              </div>
                            )}
                            {((get(formik.touched, `owners[${index}].membership_start_date`) && get(formik.errors, `owners[${index}].membership_start_date`) || get(errors, `owners.${index}.membership_start_date`))) && (
                              <div className="mt-2 text-danger">
                                {get(formik.errors, `owners[${index}].membership_start_date`) && (`${get(formik.errors, `owners[${index}].membership_start_date`)}`)}
                                {get(errors, `owners.${index}.membership_start_date`) && (`${get(errors, `owners.${index}.membership_start_date`)}`)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex-1 w-full mt-3 xl:mt-0">
                            <div className="flex flex-col items-center md:flex-row">
                              <Litepicker
                                id="membership_start_date"
                                name="membership_start_date"
                                value={formik.values.owners[index].membership_start_date}
                                onChange={(e) => {
                                  formik.setFieldValue(`owners[${index}].membership_start_date`, e.target.value)
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
                                    "border-danger": (get(formik.touched, `owners[${index}].membership_start_date`) && get(formik.errors, `owners[${index}].membership_start_date`)) || get(errors, `owners.${index}.membership_start_date`)
                                  })}
                              />
                              <Litepicker
                                id="membership_end_date"
                                name="membership_end_date"
                                value={formik.values.owners[index].membership_end_date}
                                onChange={(e) => {
                                  formik.setFieldValue(`owners[${index}].membership_end_date`, e.target.value)
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
                                    "border-danger": (get(formik.touched, `owners[${index}].membership_end_date`) && get(formik.errors, `owners[${index}].membership_end_date`)) || get(errors, `owners.${index}.membership_end_date`)
                                  })}
                              />
                            </div>
                            {(() => {
                              const fields = ["membership_end_date", "membership_start_date"];
                              const firstErrorField = fields.find((field) => (get(formik.touched, `owners[${index}].${field}`) && get(formik.errors, `owners[${index}].${field}`) || get(errors, `owners.${index}.${field}`)));

                              if (firstErrorField) {
                                const errorMessage = formik.errors[firstErrorField] ?? get(errors, `owners.${index}.${firstErrorField}`);
                                return (
                                  <div className="mt-2 text-danger">
                                    {`${errorMessage}`}
                                  </div>
                                );
                              }

                              return null;
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {formik.values.owners.length > 1 && (
                <>
                  <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                    <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Доля садовода</div>
                          <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                            Обязательное
                          </div>
                        </div>
                        <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
                          Пожалуйста, укажите долю садовода, которой он владеет согласно документам на участок.
                        </div>
                      </div>
                    </label>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <InputGroup className="mt-2">
                        <FormInput
                          id={`owners[${index}].ownership_percentage`}
                          type="text"
                          name={`owners[${index}].ownership_percentage`}
                          className={clsx({
                            "!border-danger": (get(formik.touched, `owners[${index}].ownership_percentage`) && formik.errors.owners_share) || get(errors, `owners.${index}.ownership_percentage`) || get(errors, `owners_share`),
                          })}
                          value={formik.values.owners[index].ownership_percentage}
                          onChange={formik.handleChange}
                          placeholder="50"
                          aria-label="Доля который владеет садовод"
                          aria-describedby="input-group-area"
                        />
                        <InputGroup.Text id="input-group-area">
                          %
                        </InputGroup.Text>
                      </InputGroup>
                      {(((get(formik.touched, `owners[${index}].ownership_percentage`) && formik.errors.owners_share) || get(errors, `owners.${index}.ownership_percentage`) || get(errors, `owners_share`))) && (
                        <div className="mt-2 text-danger">
                          {get(formik.errors, `owners[${index}].ownership_percentage`) && (`${get(formik.errors, `owners[${index}].ownership_percentage`)}`)}
                          {get(errors, `owners.${index}.ownership_percentage`) && (`${get(errors, `owners.${index}.ownership_percentage`)}`)}
                          {get(errors, `owners_share`) && (`${get(errors, `owners_share`)}`)}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    className="flex items-center mt-3.5 -mb-1 font-medium text-danger"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <Lucide className="w-4 h-4 stroke-[1.3] mr-1"
                            icon="Minus" />
                    Удалить владельца
                  </button>
                </>
              )}
              {index < formik.values.owners.length - 1 && (
                <hr className="my-10" />
              )}
            </div>
          ))}
        </>
      )}
    </FieldArray>
  );
}
