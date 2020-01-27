const Memcached = require('memcached');
const config = require('../../config/config.js');

let memcached = new Memcached(config.memcached.default)

const user = () => {
}

user.list = (param, res, callback) => {
    memcached.get('userList', function(err, data){
        //from cache..
        if (data) {
            console.log('users from cache..')
            return callback(data);
        }
        else {
            let sql = require('../libraries/mysql');
            let query = "SELECT SUser.ID FROM SUser "
                query += "LEFT JOIN SAccessTransport ON SUser.ID = SAccessTransport.UserPID "
                query += "WHERE SchoolUUID = ? OR SUser.Type = 'SuperTransport' "
                query += "UNION "
                query += "SELECT SUser.ID FROM SUser "
                query += "LEFT JOIN SAccessSchool ON SUser.ID = SAccessSchool.UserPID "
                query += "WHERE SAccessSchool.SchoolUUID = ? OR SUser.Type = 'SuperAdmin'";

            sql.query(query, [param.SchoolID, param.SchoolID], (err, users) => {
                if(err) {
                    console.log(users)
                    return res.send({
                        success: false,
                        data: {message: err}
                    });
                }
                //No user found
                if(users.length === 0) {
                    return res.send({
                        success: false,
                        data: 'There is no user information'
                    });
                }
                memcached.set('userList', users, 10000, (err) => {
                    console.log('set memcache error', err)
                });
                console.log('users from db..')
                return callback(users);
            })            
        }

    });
}

module.exports = user;