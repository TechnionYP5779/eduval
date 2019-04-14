module.exports = (sequelize, type) => {
  return sequelize.define('note', {
    studentId: {
      type: type.BIGINT(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: type.STRING(500),
    email: type.STRING(1000),
    phone: type.STRING(100),
    idToken: type.STRING(200)
  })
}

