import employees from '../../assets/employee.json'
import jwt from 'jsonwebtoken'
export default defineEventHandler(async (event) => {
  const userToCheck = await readBody(event)
  const usernameToCheck = userToCheck.username
  const pwdTocheck = userToCheck.password
  const privateKey = 'private'
  const employeeFound = employees.find((employeeToCheck) => {
    return (usernameToCheck === employeeToCheck.email && pwdTocheck === employeeToCheck.motDePasse)
  })
  console.log('here')
  console.log(employeeFound)
  if (employeeFound !== null && employeeFound !== undefined) {
    return jwt.sign(usernameToCheck, privateKey)
  }

  return 'error'
//   return (
//     'error : invalid credentials'
//   )
})
