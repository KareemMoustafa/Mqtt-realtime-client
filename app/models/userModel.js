
const sql = require('../libraries/mysql');
const Memcached = require('memcached');

let memcached = new Memcached("127.0.0.1:11211")

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
            let query = "SELECT SAccessTransport.UserPID,SAccessTransport.SchoolPID FROM SAccessTransport WHERE SchoolUUID = ?"
            query +=  "UNION SELECT SAccessSchool.UserPID,SAccessSchool.SchoolPID FROM SAccessSchool where SAccessSchool.SchoolUUID = ?";
            sql.query(query, [param.SchoolID, param.SchoolID], (err, users) => {
                if(err) {
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
                memcached.set('userList', users, 10000 , (err) => {
                    console.log('set memcache error', err)
                });
                console.log('users from db..')
                return callback(users);
            })            
        }

    });
}

module.exports = user;