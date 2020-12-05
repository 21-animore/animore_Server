const pool = require('../modules/pool');
const encrypt = require('../modules/crypto');

module.exports = {

    //회원가입
    signup: async (user_name, user_email, user_password, salt, user_img, user_img_flag) => {
        const fields = 'user_name, user_email, user_password, salt, user_img, user_img_flag';
        const questions = `?, ?, ?, ?, ?, ?`;
        const values = [user_name, user_email, user_password, salt, user_img, user_img_flag];
        const query = `INSERT INTO user (${fields}) VALUES (${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('signup ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('signup ERROR : ', err);
            throw err;
        }
    },

    signIn: async(user_email, salt, user_password) => {
        const query = `SELECT user_idx FROM user WHERE user_email = "${user_email}" AND salt = "${salt}" AND user_password = "${user_password}"`;

        try {
            const result = await pool.queryParam(query);
            const insertId = result[0]["user_idx"];
            return insertId;
        } catch (err) {
            console.log('signIn ERROR : ', err);
            return false;
        }
    },

    checkUserByEmail: async(user_email) => {
        const query = `SELECT salt FROM user WHERE user_email = "${user_email}"`;

        try {
            const result = await pool.queryParam(query);
            return result[0]["salt"];
        } catch (err) {
            console.log('checkUserByEmail ERROR : ', err);
            return false;
        }
    },

    checkDuplicateEmail: async(user_email) => {
        const query = `SELECT COUNT(*) FROM user WHERE user_email = "${user_email}"`;

        try {
            const result = await pool.queryParam(query);
            return result[0]["COUNT(*)"];
        } catch (err) {
            console.log('checkDuplicateEmail ERROR : ', err);
            return false;
        }
    },

    checkUserByIdx: async(user_idx) => {
        const query = `SELECT salt FROM user WHERE user_idx = ${user_idx}`;

        try{
            const result = await pool.queryParam(query);
            return result[0]["salt"];
        }catch(err){
            console.log('checkUserByIdx ERROR : ', err.errno, err.code);
            return false;
        }
    },

    checkPassword: async(user_idx, salt, user_password) => {
        const query = `SELECT user_idx FROM user  WHERE user_idx = ${user_idx} AND salt = "${salt}" AND user_password = "${user_password}"`;

        try {
            const result = await pool.queryParam(query);
            if(result[0]){
                return true;
            }else{
                return false;
            }
        } catch (err) {
            console.log('checkPassword ERROR : ', err);
            return false;
        }
    },

    checkUserIdx : async (user_idx) => {
        const query = `SELECT COUNT(*) FROM user WHERE user_idx = ${user_idx}`;
        try{
            const result = await pool.queryParam(query);
            return result[0]["COUNT(*)"];
        }catch (err){
            console.log('getMypage ERROR : ', err);
            //throw err;
            return 0; //숫자가 아닌 값이 들어올 경우 catch에 잡히는데 이때 임의로 0이라는 값을 넘겨서
        }
    },

    //프로필조회
    getMypage : async (user_idx) => {
        const query = `SELECT user_img, user_name, user_img_flag FROM user WHERE user_idx = ${user_idx}`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch (err){
            console.log('getMypage ERROR : ', err);
            //throw err;
            return -1;
        }
    },

    //프로필이름변경
    changeProfileName : async (user_idx, user_name) => {
        const query = `UPDATE user SET user_name = "${user_name}" WHERE user_idx = ${user_idx}`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch (err){
            console.log('getMypage ERROR : ', err);
            return -1;
            //throw err;
        }
    }
}