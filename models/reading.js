class Reading {
    constructor(id, title, domain, word_count, url, user_id) {
        this.id = id,
        this.title = title,
        this.domain = domain,
        this.word_count = word_count,
        this.url = url,
        this.user_id = user_id
    }
}

module.exports = {Reading: Reading};