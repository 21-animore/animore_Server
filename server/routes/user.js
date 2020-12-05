var express = require('express');
var router = express.Router();
const userController = require('../controller/userController');

//회원가입 및 로그인 관련
//router.post('/checkid', userController.checkID);
router.post('/signup', userController.signup);
router.post('/signin', userController.signIn);
router.post('/checkpassword', userController.checkPassword);

//마이페이지 확인 및 정보 수정
router.get('/mypage/:user_idx', userController.getMypage);
router.put('/mypage/edit', userController.changeProfileName);

module.exports = router;