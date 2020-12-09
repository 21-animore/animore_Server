const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const CardDao = require('../dao/card');

module.exports = {
    //카드 추가
    startMission: async (req, res) => {

        //카드 추가에 필요한 정보 받음
        //받지 않은 now_flag는 true로, mission_acheive_count는 0으로 insert
        const { user_idx, mission_name, mission_category, mission_period, mission_start_date, mission_end_date, mission_content, continue_flag } = req.body;

        //하나라도 안 들어오면 400
        if (!user_idx || !mission_name || !mission_period || !mission_start_date || !mission_end_date || !mission_content) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        //정보 제대로 잘 들어오면 DB 접근
        const createCard = await CardDao.createCard(user_idx, mission_name, mission_category, mission_period, mission_start_date, mission_end_date, mission_content, continue_flag);
        if (createCard === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        //올바른 응답
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_CARD, createCard));
    },

    showRandomCard: async (req, res) => {
        //카드 유형 받음
        const { card_category_flag } = req.params;

        const idx = Math.floor(Math.random() * 4);

        //정보 제대로 잘 들어오면 DB 접근
        const showRandomCardMissionName = await CardDao.showRandomCardMissionName(card_category_flag, idx);
        if (showRandomCardMissionName === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        //정보 제대로 잘 들어오면 DB 접근
        const showRandomCardContent = await CardDao.showRandomCardContent(card_category_flag, idx);
        if (showRandomCardContent === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        //올바른 응답
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_RANDOM_CARD_CONTENT, {
            mission_name : showRandomCardMissionName,
            mission_content : showRandomCardContent
        }));
    },

    getAllCards: async (req, res) => {
        //user_idx 받아와야
        const { user_idx } = req.params;

        //하나라도 안 들어오면 404
        if (!user_idx) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        //정보 제대로 잘 들어오면 DB 접근
        const getAllCards = await CardDao.getAllCards(user_idx);
        if (getAllCards === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        //올바른 응답
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_ALL_CARD, getAllCards));
    },

    getRandomSentence: async (req, res) => {
        //받을 정보 없음

        //정보 제대로 잘 들어오면 DB 접근
        const getRandomSentence = await CardDao.getRandomSentence();
        if (getRandomSentence === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        //올바른 응답
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_RANDOM_TEXT, getRandomSentence));
    },

    addAchieveCount: async (req, res) => {
        //user_idx, 카드 정보 받아와야
        const { user_idx, mission_name, mission_period } = req.body;

        //하나라도 안 들어오면 404
        if (!user_idx || !mission_name || !mission_period) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        //정보 제대로 잘 들어오면 DB 접근
        const addAchieveCount = await CardDao.addAchieveCount(user_idx, mission_name, mission_period);
        if (addAchieveCount === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        //올바른 응답 - 카드 +1 누르면 나오는 응원 문구
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ADD_COUNT, addAchieveCount));
    },

    missionFail: async (req, res) => {
        //user_idx, 카드 정보 받아와야
        const { user_idx, mission_name } = req.body;

        //하나라도 안 들어오면 404
        if (!user_idx || !mission_name) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        //정보 제대로 잘 들어오면 DB 접근
        const missionFail = await CardDao.missionFail(user_idx, mission_name);
        if (missionFail === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        //올바른 응답 - 카드 +1 누르면 나오는 응원 문구
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MISSION_FAIL));
    },

    giveupMission: async (req, res) => {
        //user_idx, 카드 정보 받아와야
        const { user_idx, mission_name } = req.body;

        //하나라도 안 들어오면 404
        if (!user_idx || !mission_name) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        //정보 제대로 잘 들어오면 DB 접근
        const giveupMission = await CardDao.giveupMission(user_idx, mission_name);
        if (giveupMission === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        //올바른 응답
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GIVEUP_MISSION));
    },
    
    getAllPastCards: async (req, res) => {
        //user_idx 받아와야
        const { user_idx } = req.params;

        //하나라도 안 들어오면 404
        if (!user_idx) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        //정보 제대로 잘 들어오면 DB 접근
        const getAllPastCards = await CardDao.getAllPastCards(user_idx);
        if (getAllPastCards === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        //올바른 응답
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_ALL_PAST_CARDS, getAllPastCards));
    }
}