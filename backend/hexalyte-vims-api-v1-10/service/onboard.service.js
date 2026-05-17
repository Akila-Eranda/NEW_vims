const db = require('../models')
const bcrypt = require('bcryptjs')
const User = db.user

const newUser = async (userInfo) => {

    const { firstname, lastname, username, email, password, role, gender, birthday } = userInfo;

    try {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const user = {
            firstname,
            lastname,
            username,
            email,
            password: hash,
            role,
            active: 1,
            deleted: 0,
            gender,
            birthday
        }

        const [row, created] = await User.findOrCreate({
            where: { email: user.email },
            defaults: user
        }) 

        if (created) {
            return row
        }

        return null

    } catch (error) {
        return `Error onboarding user: ${error.message}`
    }

}

module.exports = {newUser}