import { ref } from 'vue'

type FormKey<TForm> = Extract<keyof TForm, string>

export interface ValidationRule<TForm, TValue = unknown> {
  message: string
  validate: (value: TValue, form: TForm) => boolean
}

export type ValidationSchema<TForm extends object> = {
  [K in keyof TForm]?: Array<ValidationRule<TForm, TForm[K]>>
}

export type ValidationErrors<TForm extends object> = {
  [K in keyof TForm]: string[]
}

function createEmptyErrors<TForm extends object>(
  schema: ValidationSchema<TForm>,
): ValidationErrors<TForm> {
  return Object.keys(schema).reduce((accumulator, key) => {
    accumulator[key as FormKey<TForm>] = []
    return accumulator
  }, {} as ValidationErrors<TForm>)
}

export function useValidate<TForm extends object>(schema: ValidationSchema<TForm>) {
  const errors = ref<ValidationErrors<TForm>>(createEmptyErrors(schema))

  function resetErrors(): void {
    for (const key of Object.keys(errors.value) as Array<FormKey<TForm>>) {
      errors.value[key] = []
    }
  }

  function validateField(field: FormKey<TForm>, form: TForm): boolean {
    const fieldRules = schema[field] ?? []
    errors.value[field] = []

    for (const rule of fieldRules) {
      if (!rule.validate(form[field], form)) {
        errors.value[field].push(rule.message)
      }
    }

    return errors.value[field].length === 0
  }

  function validateForm(form: TForm): boolean {
    let isValid = true

    for (const field of Object.keys(schema) as Array<FormKey<TForm>>) {
      const fieldIsValid = validateField(field, form)
      if (!fieldIsValid) {
        isValid = false
      }
    }

    return isValid
  }

  return {
    errors,
    resetErrors,
    validateField,
    validateForm,
  }
}