import { useState, type FormEvent } from "react";
import type { PassportFormValues } from "../domain/passport";
import {
  OPTIONAL_TEXT_MAX_LENGTH,
  PREFERRED_NAME_MAX_LENGTH,
  trimPassportFormValues,
  validatePassportForm,
  type PassportFormErrors,
} from "../domain/validation";

type PassportFormProps = {
  initialValues: PassportFormValues;
  submitLabel: string;
  onSubmit: (values: PassportFormValues) => void;
  onCancel: () => void;
};

type TextFieldKey = Exclude<keyof PassportFormValues, "consentConfirmed">;

function fieldId(field: keyof PassportFormValues): string {
  return `field-${field}`;
}

function errorId(field: keyof PassportFormValues): string {
  return `error-${field}`;
}

export function PassportForm({ initialValues, submitLabel, onSubmit, onCancel }: PassportFormProps) {
  const [values, setValues] = useState<PassportFormValues>(initialValues);
  const [errors, setErrors] = useState<PassportFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const updateText = (field: TextFieldKey, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  const updateConsent = (value: boolean) => {
    setValues((previous) => ({ ...previous, consentConfirmed: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = trimPassportFormValues(values);
    const validationErrors = validatePassportForm(trimmed);
    setValues(trimmed);
    setErrors(validationErrors);
    setSubmitted(true);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(trimmed);
    }
  };

  const showSummary = submitted && Object.keys(errors).length > 0;

  function renderTextField(field: TextFieldKey, label: string, multiline: boolean, maxLength: number) {
    const error = errors[field];
    const describedBy = error ? errorId(field) : undefined;
    return (
      <div className="form-field">
        <label htmlFor={fieldId(field)}>{label}</label>
        {multiline ? (
          <textarea
            id={fieldId(field)}
            value={values[field]}
            maxLength={maxLength}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            onChange={(event) => updateText(field, event.target.value)}
          />
        ) : (
          <input
            id={fieldId(field)}
            type="text"
            value={values[field]}
            maxLength={maxLength}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            onChange={(event) => updateText(field, event.target.value)}
          />
        )}
        {error ? (
          <p id={errorId(field)} className="form-field-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {showSummary ? (
        <div className="form-error-summary" role="alert">
          <h3>Revisa los siguientes campos</h3>
          <ul>
            {Object.values(errors).map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <fieldset>
        <legend>Cómo llamarle</legend>
        {renderTextField("preferredName", "Nombre preferido", false, PREFERRED_NAME_MAX_LENGTH)}
        {renderTextField("howToAddress", "Así prefiere que le hablen", true, OPTIONAL_TEXT_MAX_LENGTH)}
      </fieldset>

      <fieldset>
        <legend>Cómo comunicarse</legend>
        {renderTextField(
          "preferredLanguage",
          "Idioma o forma de comunicación preferida",
          false,
          OPTIONAL_TEXT_MAX_LENGTH,
        )}
        {renderTextField(
          "communicationNotes",
          "Qué ayuda al comunicarse",
          true,
          OPTIONAL_TEXT_MAX_LENGTH,
        )}
        {renderTextField("sensorySupports", "Apoyos personales", true, OPTIONAL_TEXT_MAX_LENGTH)}
      </fieldset>

      <fieldset>
        <legend>Lo que le ayuda a sentirse en calma</legend>
        {renderTextField(
          "calmingRoutines",
          "Lo que le da calma o confianza",
          true,
          OPTIONAL_TEXT_MAX_LENGTH,
        )}
      </fieldset>

      <fieldset>
        <legend>Situaciones difíciles y apoyo respetuoso</legend>
        {renderTextField(
          "stressTriggers",
          "Situaciones que pueden causarle estrés",
          true,
          OPTIONAL_TEXT_MAX_LENGTH,
        )}
        {renderTextField(
          "respectfulSupport",
          "Cómo acompañarle con respeto",
          true,
          OPTIONAL_TEXT_MAX_LENGTH,
        )}
      </fieldset>

      <fieldset>
        <legend>Persona de confianza</legend>
        {renderTextField(
          "trustedContactName",
          "Persona de confianza",
          false,
          OPTIONAL_TEXT_MAX_LENGTH,
        )}
        {renderTextField("trustedContactRelation", "Relación", false, OPTIONAL_TEXT_MAX_LENGTH)}
        {renderTextField(
          "trustedContactMethod",
          "Forma de contacto",
          false,
          OPTIONAL_TEXT_MAX_LENGTH,
        )}
      </fieldset>

      <fieldset>
        <legend>Autorización</legend>
        <div className="form-field form-field-checkbox">
          <label htmlFor={fieldId("consentConfirmed")}>
            <input
              id={fieldId("consentConfirmed")}
              type="checkbox"
              checked={values.consentConfirmed}
              aria-describedby={errors.consentConfirmed ? errorId("consentConfirmed") : undefined}
              onChange={(event) => updateConsent(event.target.checked)}
            />
            Confirmo que tengo autorización para registrar esta información.
          </label>
          {errors.consentConfirmed ? (
            <p id={errorId("consentConfirmed")} className="form-field-error" role="alert">
              {errors.consentConfirmed}
            </p>
          ) : null}
        </div>
      </fieldset>

      <div className="form-actions">
        <button type="submit">{submitLabel}</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
