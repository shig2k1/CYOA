const casual = require('casual')

module.exports = (req, res) => {
  // define data structure
  casual.define('user', function () {
    return {
      name: casual.first_name,
      surname: casual.last_name,
      address: casual.street,
      phone: casual.phone,
      email: casual.email,
      postalCode: casual.zip,
      city: casual.city,
      number: casual.building_number,
      id: casual.uuid
    }
  })
  // define returned data structure
  const data = {
    users: []
  }
  // generate 100 users
  for (let i=0; i< 100; i++) {
    data.users.push(casual.user)
  }

  res.status(200).jsonp(data)
}
