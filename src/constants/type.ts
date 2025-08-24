export const Role = {
  Owner: 'Owner',
  Employee: 'Employee',
  Guest: 'Guest'
} as const

export const RoleValues = [Role.Owner, Role.Employee, Role.Guest] as const
