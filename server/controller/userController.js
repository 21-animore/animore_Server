const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const UserDao = require('../dao/user');
const encrypt  = require('../modules/crypto');

module.exports = {

  checkEmail: async(req, res) => {
    const { user_email } = req.body;

    if(!user_email){
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    }

    if(await UserDao.checkDuplicateEmail(user_email)){
      return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.ALREADY_ID)); 
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.AVAILABLE_EMAIL));
  },

  signup: async (req, res) => {
    //1. request body에서 값을 읽어온다.
    const { user_name, user_email, user_password, user_img_flag } = req.body;

    //예외처리1 : parameter 체크 - 하나라도 null이나 undefined가 들어올 경우
    if (!user_name || (!user_email && !user_password)) {
      res.status(statusCode.BAD_REQUEST).sendzzz(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
    }

    if(await UserDao.checkDuplicateEmail(user_email)){
      return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.ALREADY_ID)); 
    }

    //2. 새로운 User를 등록한다.
    const {salt, hashed} = await encrypt.encrypt(user_password);
    const idx = await UserDao.signup(user_name, user_email, hashed, salt, user_img, user_img_flag);
    if (idx === -1) {
      return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }

    //3. 가입성공
    return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_USER, idx));
  },

  signIn: async(req, res) => {
    const { user_email, user_password } = req.body;

    if(!user_email || !user_password){
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    }

    const salt = await UserDao.checkUserByEmail(user_email);

    if(!salt){
      return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.NO_USER));
    }

    const hashed = await encrypt.encryptWithSalt(user_password, salt);
    
    const user = await UserDao.signIn(user_email, salt, hashed);

    if(!user){
      return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.MISS_MATCH_PW));
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, user));
  },

  checkPassword: async(req, res) => {
    const { user_idx, user_password} = req.body;

    if(!user_idx || !user_password){
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    }

    const salt = await UserDao.checkUserByIdx(user_idx);

    if(!salt){
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    }

    const hashed = await encrypt.encryptWithSalt(user_password, salt);

    if(!await UserDao.checkPassword(user_idx, salt, hashed)){
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
    };

    return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.MATCH_PASSWORD));
  },

  withDrawal: async(req, res) => {
    const { user_idx, user_password, reason} = req.body;


    if(!user_password || !user_idx){
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    }

    const salt = await UserDao.checkUserByIdx(user_idx);

    if(!salt){
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    }

    const hashed = await encrypt.encryptWithSalt(user_password, salt);
    

    if(!await UserDao.withDrawal(user_idx, salt, hashed, reason)){
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
    };

    return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_USER));
  },

  getMypage : async (req, res) => {

    //1. request body에서 값을 읽어온다.
    const user_idx = req.params.user_idx;
    
    //예외처리1 : user_idx를 입력받지 못했을 경우
    if (!user_idx) {
      return res.status(statusCode.BAD_REQUEST).sendzzz(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    }

    //예외처리2 : 해당 user_idx가 존재하지 않을 경우
    const user = await UserDao.checkUserIdx(user_idx);
    if (user === 0) { //여기서 잡았으
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
    }

    //2. 새로운 User를 등록한다.
    const result = await UserDao.getMypage(user_idx);
    if (result === -1) {
      return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }

    //3. 조회성공
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_PROFILE_SUCCESS, {
      "user_img" : result[0].user_img,
      "user_name" : result[0].user_name
    }));
  },

  changeProfileName : async (req, res) => {

    //1. request body에서 값을 읽어온다.
    const {user_idx, user_name} = req.body;
    
    //예외처리1 : 입력받지 못했을 경우
    if (!user_idx || !user_name) {
      return res.status(statusCode.BAD_REQUEST).sendzzz(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    }

    //예외처리2 : 해당 user_idx가 존재하지 않을 경우
    const user = await UserDao.checkUserIdx(user_idx);
    if (user === 0) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
    }

    //2. 새로운 닉네임을 등록한다.
    const result = await UserDao.changeProfileName(user_idx, user_name);
    if (result === -1) {
      return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }

    //3. 수정 성공
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CHANGE_PROFILE_NAME_SUCCESS));
  }
}