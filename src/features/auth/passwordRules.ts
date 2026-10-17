/** Longueur maximale acceptée par le backend. */
export const PASSWORD_MAX_LENGTH = 128

/** Longueur du code reçu par e-mail pour changer de mot de passe. */
export const RESET_CODE_LENGTH = 4

/** Règles du mot de passe, vérifiées à la saisie (cahier des charges, EF-AUTH-3). */
export const passwordRules = [
  { label: '8 caractères au minimum', test: (value: string) => value.length >= 8 },
  { label: 'Au moins une lettre', test: (value: string) => /\p{L}/u.test(value) },
  { label: 'Au moins un chiffre', test: (value: string) => /\d/.test(value) },
]

export const meetsPasswordRules = (value: string) => passwordRules.every((rule) => rule.test(value))
