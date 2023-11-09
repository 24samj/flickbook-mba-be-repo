module.exports = {
    DB_NAME: "mba_db",
    DB_URL:
        process.env.MONGODB_URI ||
        `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.mob0anj.mongodb.net/mba_db`,
};
