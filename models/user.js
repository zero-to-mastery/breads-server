class User {
    constructor(firstName, lastName, username, email, password, image) {
        this.first_name = firstName,
        this.last_name = lastName,
        this.username = username,
        this.email = email,
        this.password = password,
        this.image = image
    }
}

module.exports = {User: User};