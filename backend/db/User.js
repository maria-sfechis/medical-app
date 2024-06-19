const sql = require("msnodesqlv8");

const userSchema = new sql.Schema(
    {
        name:String,
        email:String,
        password:String
    }
);

module.exports = sql.model("users", userSchema);