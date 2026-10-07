/** Âge en années révolues à partir d'une date de naissance au format `AAAA-MM-JJ`. */
export function getAge(birthDate: string, today = new Date()) {
  const [year, month, day] = birthDate.split('-').map(Number)
  const birthdayPassed =
    today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day)
  return today.getFullYear() - year - (birthdayPassed ? 0 : 1)
}
