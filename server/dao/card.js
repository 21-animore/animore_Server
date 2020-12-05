const pool = require('../modules/pool');

module.exports = {
    createCard : async (user_idx, mission_name, mission_category, mission_period, mission_start_date, mission_end_date) => {
        const fields = 'user_idx, mission_name, mission_category, mission_period, mission_start_date, mission_end_date';
        const questions = `?, ?, ?, ?, ?, ?`;
        const values = [user_idx, mission_name, mission_category, mission_period, mission_start_date, mission_end_date];
        const query = `INSERT INTO card (${fields}) VALUES (${questions})`;

        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            console.log('createCard ERROR : ', err);
            throw err;
        }
    },

    showRandomCard : async (card_category_flag) => {

        const query = `SELECT random_card_content FROM random_card WHERE random_card_category = ${card_category_flag}`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('showRandomCard ERROR : ', err);
            throw err;
        }
    },

    getAllCards : async (user_idx) => {

        const query = `SELECT * FROM card WHERE user_idx = ${user_idx} AND now_flag = true`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('getAllCards ERROR : ', err);
            throw err;
        }
    },

    getRandomSentence : async () => {
        const idx = 1; //여기 랜덤으로 하기

        const query = `SELECT random_text_content FROM random_text WHERE random_text_idx = ${idx}`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('getRandomSentence ERROR : ', err);
            throw err;
        }
    },

    addAchieveCount : async (user_idx, mission_name) => {
        //+1 이렇게 하면 되는건지 확인
        const query = `UPDATE card
                       SET mission_acheive_count = mission_acheive_count+1
                       WHERE user_idx = ${user_idx} AND now_flag = true AND mission_name = ${mission_name}`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('addAchieveCount ERROR : ', err);
            throw err;
        }
    },

    giveupMission : async (user_idx, mission_name) => {
        //+1 이렇게 하면 되는건지 확인
        const query = `DELETE FROM card WHERE user_idx = ${user_idx} AND now_flag = true ANDmission_name = "${mission_name}"`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('giveupMission ERROR : ', err);
            throw err;
        }
    },

    getAllPastCards : async (user_idx) => {

        const query = `SELECT * FROM card WHERE user_idx = ${user_idx} AND now_flag = false`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('getAllPastCards ERROR : ', err);
            throw err;
        }
    }
}