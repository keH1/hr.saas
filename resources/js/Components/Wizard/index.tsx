import React, {ReactNode, useState} from 'react';
import {Form, Formik, FormikHelpers, FormikProps} from 'formik';
import * as Yup from 'yup';
import clsx from "clsx";
import Button from "@/Components/Base/Button";
import Lucide from "@/Components/Base/Lucide";
import LoadingIcon from "@/Components/Base/LoadingIcon";

interface WizardStepProps {
  name: string;
  children: ReactNode;
  validationSchema?: Yup.AnyObjectSchema;
  onSubmit?: (values: any, helpers: FormikHelpers<any>) => void;
  extraActions?: (formik: FormikProps<any>) => React.ReactNode;
}

interface WizardProps {
  children: ReactNode;
  initialValues: any;
  onSubmit: (values: any, helpers: FormikHelpers<any>) => void;
  validateOnChange?: boolean;
  validateOnMount?: boolean;
}

export const Wizard: React.FC<WizardProps> = ({children, initialValues, onSubmit, validateOnChange, validateOnMount}) => {
  const [stepNumber, setStepNumber] = useState<number>(0);
  const steps = React.Children.toArray(children) as React.ReactElement<WizardStepProps>[];
  const [snapshot, setSnapshot] = useState(initialValues);

  const step = steps[stepNumber];
  const totalSteps = steps.length;
  const isLastStep = stepNumber === totalSteps - 1;

  const next = (values: any) => {
    setSnapshot(values);
    setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
  };

  const previous = (values: any) => {
    setSnapshot(values);
    setStepNumber(Math.max(stepNumber - 1, 0));
  };

  const handleSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    if (step.props.onSubmit) {
      await step.props.onSubmit(values, helpers);
    }
    if (isLastStep) {
      return onSubmit(values, helpers);
    } else {
      await helpers.setTouched({});
      next(values);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12 sm:col-span-10 sm:col-start-2">
        <div className="flex flex-col lg:items-center lg:flex-row gap-y-2">
          {steps.map((step, index) => (
            <div
              key={index + 1}
              className={clsx([
                "flex items-center lg:justify-center flex-1 lg:first:justify-start lg:last:justify-end group",
                "after:hidden before:hidden after:lg:block before:lg:block",
                "first:after:content-[''] first:after:w-full first:after:bg-slate-300/60 first:after:h-[2px] first:after:ml-5 group-[.mode--light]:first:after:bg-slate-300/20",
                "last:before:content-[''] last:before:w-full last:before:bg-slate-300/60 last:before:h-[2px] last:before:mr-5 group-[.mode--light]:last:before:bg-slate-300/20",
                "last:after:hidden after:content-[''] after:w-full after:bg-slate-300/60 after:h-[2px] after:ml-5 group-[.mode--light]:after:bg-slate-300/20",
                "first:before:hidden before:content-[''] before:w-full before:bg-slate-300/60 before:h-[2px] before:mr-5 group-[.mode--light]:before:bg-slate-300/20",
                index <= stepNumber && 'active'
              ])}
            >
              <div className="flex items-center">
                <div className="bg-white border rounded-full group-[.mode--light]:!bg-transparent group-[.active]:bg-primary group-[.active]:text-white group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-white/[0.25] [.group.mode--light_.group.active_&]:!bg-white/[0.12] [.group.mode--light_.group.active_&]:!border-white/[0.15]">
                  <div className="flex items-center justify-center w-10 h-10">
                    {index + 1}
                  </div>
                </div>
                <div className="ml-3.5 group-[.mode--light]:!text-slate-300 font-medium whitespace-nowrap text-slate-500 group-[.active]:text-current [.group.mode--light_.group.active_&]:!text-slate-100">
                  {step.props.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <div className="flex flex-col box box--stacked">
            <Formik initialValues={snapshot}
                    onSubmit={handleSubmit}
                    validationSchema={step.props.validationSchema}
                    validateOnChange={validateOnChange}
                    validateOnMount={validateOnMount}>
              {formik => (
                <Form>
                  <div className="p-7">
                    {step}
                  </div>
                  <div className="flex py-5 border-t md:justify-between px-7 border-slate-200/80">
                    <div className="flex items-center">
                      {stepNumber > 0 && (
                        <Button
                          disabled={formik.isSubmitting}
                          variant="outline-primary"
                          className="w-full px-10 md:w-auto border-primary/50"
                          onClick={previous}
                          type="button"
                        >
                          <Lucide
                            icon="ArrowLeftCircle"
                            className="stroke-[1.3] w-4 h-4 mr-2 -ml-2"
                          />
                          Назад
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {step.props.extraActions && step.props.extraActions(formik)}
                      <Button
                        disabled={formik.isSubmitting}
                        variant="outline-primary"
                        className="w-full px-10 md:w-auto border-primary/50 ml-auto"
                        type="submit"
                      >
                        {formik.isSubmitting ? (
                          <LoadingIcon icon="oval" color="#03045e" className="stroke-[1.3] w-4 h-4 mr-2 -ml-2" />
                        ) : (
                          <Lucide
                            icon={isLastStep ? 'Send' : 'ArrowRightCircle'}
                            className="stroke-[1.3] w-4 h-4 mr-2 -ml-2"
                          />
                        )}
                        {isLastStep ? 'Создать' : 'Далее'}
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WizardStep: React.FC<WizardStepProps> = ({children}) => {
  return <>{children}</>;
};
