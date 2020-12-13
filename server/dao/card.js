const pool = require('../modules/pool');

module.exports = {
    createCard : async (user_idx, mission_name, mission_category, mission_period, mission_start_date, mission_end_date, mission_content, continue_flag) => {
        const fields = 'user_idx, mission_name, mission_category, mission_period, mission_start_date, mission_end_date, mission_content, continue_flag';
        const questions = `?, ?, ?, ?, ?, ?, ?, ?`;
        const values = [user_idx, mission_name, mission_category, mission_period, mission_start_date, mission_end_date, mission_content, continue_flag];
        const query = `INSERT INTO card (${fields}) VALUES (${questions})`;

        try {
            await pool.queryParamArr(query, values);

            var category_idx;

            if(continue_flag === 1){
                if(mission_period === 7){
                    category_idx = 1;
                }else if(mission_period === 14){
                    category_idx = 2;
                }else if(mission_period === 21){
                    category_idx = 3;
                }
            }else{
                category_idx = 0;
            }

            //여기서 그 랜덤 생성 문구 보내주기
            const query2 = `SELECT random_add_text_content FROM random_add_text WHERE random_add_text_category = ${category_idx}`;
            const result2 = await pool.queryParam(query2);

            const idx = Math.floor(Math.random() * 5);
            return result2[idx]["random_add_text_content"];
        } catch (err) {
            console.log('createCard ERROR : ', err);
            throw err;
        }
    },

    showRandomCardMissionName : async (card_category_flag, idx) => {

        const query = `SELECT random_mission_name FROM random_card WHERE random_card_category = ${card_category_flag}`;

        try {
            const result = await pool.queryParam(query);
            return result[idx]["random_mission_name"];
        } catch (err) {
            console.log('showRandomCardMissionName ERROR : ', err);
            throw err;
        }
    },

    showRandomCardContent : async (card_category_flag, idx) => {

        const query = `SELECT random_card_content FROM random_card WHERE random_card_category = ${card_category_flag}`;

        try {
            const result = await pool.queryParam(query);
            return result[idx]["random_card_content"];
        } catch (err) {
            console.log('showRandomCard ERROR : ', err);
            throw err;
        }
    },

    getAllCards : async (user_idx) => {

        const query = `SELECT * FROM card WHERE user_idx = ${user_idx} AND now_flag = 1`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('getAllCards ERROR : ', err);
            throw err;
        }
    },

    getContinuousCards : async (user_idx) => {

        const query = `SELECT * FROM card WHERE user_idx = ${user_idx} AND now_flag = 1 AND continue_flag = 1`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('getContinuousCards ERROR : ', err);
            throw err;
        }
    },

    getNormalCards : async (user_idx) => {

        const query = `SELECT * FROM card WHERE user_idx = ${user_idx} AND now_flag = 1 AND continue_flag = 0`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('getNormalCards ERROR : ', err);
            throw err;
        }
    },

    getRandomSentence : async () => {
        const idx = Math.floor(Math.random() * 60);
        console.log(1+idx);
        const query = `SELECT random_text_content FROM random_text WHERE random_text_idx = ${1+idx}`;

        try {
            const result = await pool.queryParam(query);
            return result[0]["random_text_content"];
        } catch (err) {
            console.log('getRandomSentence ERROR : ', err);
            throw err;
        }
    },

    addAchieveCount : async (user_idx, mission_name, mission_period, click_date) => {
        //먼저 count 받아오기
        const query1 = `SELECT mission_acheive_count FROM card
                        WHERE user_idx = ${user_idx} AND now_flag = 1 AND mission_name = "${mission_name}"`
                        

        try {
            const result1 = await pool.queryParam(query1);
            const afterAddResult = result1[0]["mission_acheive_count"] +1;

            if(afterAddResult == mission_period){
                //+1한 count랑 period랑 동일하면 과거로 옮겨야됨
                const query2 = `UPDATE card
                               SET mission_acheive_count = ${afterAddResult}, success_flag = 1, now_flag = 0, click_date = "${click_date}"
                               WHERE user_idx = ${user_idx} AND now_flag = 1 AND mission_name = "${mission_name}"`;
                await pool.queryParam(query2);
            }else{
                //+1
                const query3 = `UPDATE card
                               SET mission_acheive_count = ${afterAddResult}, click_date = "${click_date}"
                               WHERE user_idx = ${user_idx} AND now_flag = 1 AND mission_name = "${mission_name}"`;
                await pool.queryParam(query3);
            }

            //카드 문구에 뜰 부분
            const idx = Math.floor(Math.random() * 29);
            const query4 = `SELECT random_success_text_content FROM random_success_text WHERE random_success_text_idx = ${idx}`;
            const result4 = await pool.queryParam(query4);
            console.log(result4[0]["random_success_text_content"]);
            return result4[0]["random_success_text_content"];
            

        } catch (err) {
            console.log('addAchieveCount ERROR : ', err);
            throw err;
        }
    },

    missionFail : async (user_idx, mission_name) => {
        //과거로 보내버리기
        const query = `UPDATE card
                       SET now_flag = 0
                       WHERE user_idx = ${user_idx} AND now_flag = 1 AND mission_name = "${mission_name}"`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('missionFail ERROR : ', err);
            throw err;
        }
    },

    giveupMission : async (user_idx, mission_name) => {
        const query = `DELETE FROM card WHERE user_idx = ${user_idx} AND now_flag = 1 AND mission_name = "${mission_name}"`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('giveupMission ERROR : ', err);
            throw err;
        }
    },

    getAllPastCards : async (user_idx) => {

        const query = `SELECT * FROM card WHERE user_idx = ${user_idx} AND now_flag = 0`;

        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('getAllPastCards ERROR : ', err);
            throw err;
        }
    },

    getAllSucessPastCardsCount : async (user_idx) => {

        const query = `SELECT COUNT(*) FROM card WHERE user_idx = ${user_idx} AND now_flag = 0 AND success_flag = 1`;

        try {
            const result = await pool.queryParam(query);
            return result[0]["COUNT(*)"];
        } catch (err) {
            console.log('getAllPastCards ERROR : ', err);
            throw err;
        }
    }
}