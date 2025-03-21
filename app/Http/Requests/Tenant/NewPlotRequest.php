<?php

namespace App\Http\Requests\Tenant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class NewPlotRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            //Step 1
            'plot_number' => [
                'required',
                'string',
                Rule::unique('plots', 'plot_number')
                    ->where(function ($query) {
                        return $query->where('street_id', $this->input('street.value'));
                    }),
            ],
            'street' => ['required', 'array'],
            'cadastre_number' => ['required', 'string'],
            'area' => ['required', 'numeric'],
            //Step 2
            'owners' => ['required', 'array', 'min:1'],
            'owners.*.isNew' => ['required', 'boolean'],
            'owners.*.gardenerId' => ['required_if:owners.*.isNew,false', 'array'],
            'owners.*.lastName.value' => ['required_if:owners.*.isNew,true'],
            'owners.*.firstName.value' => ['required_if:owners.*.isNew,true'],
            'owners.*.secondName.value' => ['required_if:owners.*.isNew,true'],
            'owners.*.gender' => ['required_if:owners.*.isNew,true', 'string'],
            'owners.*.registration_address.value' => ['required_if:owners.*.isNew,true', 'string'],
            'owners.*.residence_address.value' => ['string'],
            'owners.*.mailing_address.value' => ['string'],
            'owners.*.is_member' => ['boolean'],
            'owners.*.membership_start_date' => [
                'required_if:owners.*.isNew,true',
                'date'
            ],
            'owners.*.membership_end_date' => ['date'],
            'owners.*.ownership_percentage' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100'
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'owners' => array_map(function ($owner) {
                return [
                        'ownership_percentage' => isset($owner['ownership_percentage']) ? (float)$owner['ownership_percentage'] : null
                    ] + $owner;
            }, $this->input('owners', [])),
        ]);
    }


    private function ownersSometimesRules(Validator $validator): void
    {
        $data = $validator->getData();
        if (isset($data['owners']) && is_array($data['owners'])) {
            foreach ($data['owners'] as $index => $owner) {
                $validator->sometimes("owners.$index.gardenerId", 'nullable', function ($input) use ($index) {
                    return data_get($input, "owners.$index.isNew") === true;
                })->sometimes("owners.$index.gender", 'nullable', function ($input) use ($index) {
                    return data_get($input, "owners.$index.isNew") === false;
                })->sometimes("owners.$index.residence_address.value", 'nullable', function ($input) use ($index) {
                    return data_get($input, "owners.$index.isNew") === false || (data_get(
                                $input,
                                "owners.$index.is_same_with_residence"
                            ) === true);
                })->sometimes("owners.$index.mailing_address.value", 'nullable', function ($input) use ($index) {
                    return data_get($input, "owners.$index.isNew") === false || (data_get(
                                $input,
                                "owners.$index.isNew"
                            ) === true && data_get(
                                $input,
                                "owners.$index.is_same_with_mailing"
                            ) === true);
                })->sometimes("owners.$index.membership_start_date", 'nullable', function ($input) use ($index) {
                    return data_get($input, "owners.$index.isNew") === false;
                })->sometimes("owners.$index.membership_end_date", 'nullable', function ($input) use ($index) {
                    return data_get($input, "owners.$index.isNew") === false || (data_get(
                                $input,
                                "owners.$index.isNew"
                            ) === true && data_get(
                                $input,
                                "owners.$index.is_member"
                            ) === true);
                });

                $validator->sometimes("owners.$index.residence_address.value", 'required', function ($input) use ($index) {
                    return data_get($input, "owners.$index.isNew") === true && data_get(
                            $input,
                            "owners.$index.is_same_with_residence"
                        ) === false;
                })->sometimes("owners.$index.mailing_address.value", 'required', function ($input) use ($index) {
                    return data_get($input, "owners.$index.isNew") === true && data_get(
                            $input,
                            "owners.$index.is_same_with_mailing"
                        ) === false;
                })->sometimes("owners.$index.membership_end_date", 'required', function ($input) use ($index) {
                    return data_get($input, "owners.$index.isNew") === true && data_get(
                            $input,
                            "owners.$index.is_member"
                        ) === false;
                });
            }
        }
    }

    public function withValidator(Validator $validator): void
    {
        $this->ownersSometimesRules($validator);

        $validator->after(function ($validator) {
            $owners = $this->input('owners', []);

            // Проверяем сумму процентов владения
            $ownershipSum = array_reduce($owners, fn($sum, $owner) => $sum + ($owner['ownership_percentage'] ?? 0), 0);
            if ($ownershipSum > 100) {
                $validator->errors()->add('owners_share', 'Суммарная доля не должна превышать 100%.');
            }

            // Если больше одного владельца - все должны иметь процент
            if (count($owners) > 1) {
                foreach ($owners as $index => $owner) {
                    if (!isset($owner['ownership_percentage']) || trim((string)$owner['ownership_percentage']) === '') {
                        $validator->errors()->add(
                            "owners.{$index}.ownership_percentage",
                            'Доля садовода обязательна, если владельцев больше одного.'
                        );
                    }
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'plot_number.required' => 'Номер участка обязателен.',
            'street.required' => 'Улица обязательна.',
            'cadastre_number.required' => 'Кадастровый номер обязателен.',
            'area.required' => 'Площадь обязательна.',
            'owners.required' => 'Добавьте хотя бы одного владельца.',
            'owners.min' => 'Добавьте хотя бы одного владельца.',
            'owners.*.gardenerId.required' => 'Выберите садовода.',
            'owners.*.lastName.value.required' => 'Фамилия обязательна.',
            'owners.*.firstName.value.required' => 'Имя обязательно.',
            'owners.*.secondName.value.required' => 'Отчество обязательно.',
            'owners.*.gender.required' => 'Пол обязателен.',
            'owners.*.registration_address.value.required' => 'Адрес регистрации обязателен.',
            'owners.*.residence_address.value.required' => 'Адрес проживания обязателен.',
            'owners.*.mailing_address.value.required' => 'Почтовый адрес обязателен.',
            'owners.*.membership_start_date.required' => 'Дата начала членства обязательна.',
            'owners.*.membership_end_date.required' => 'Дата завершения членства обязательна.',
            'owners.*.ownership_percentage.min' => 'Доля не может быть меньше 0%.',
            'owners.*.ownership_percentage.max' => 'Доля не может быть больше 100%.',
            'plot_number.unique' => 'Участок с таким номером уже существует на этой улице.',
        ];
    }
}
