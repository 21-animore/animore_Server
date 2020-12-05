var express = require('express');
var router = express.Router();
const cardController = require('../controller/cardController');

/*  add fragment    */

//미션 스타트 - DB에 카드 정보 추가
router.post('/start', cardController.startMission);

//카드 추가 시 랜덤 카드 정보 출력
router.get('/showrandomcard/:card_category_flag', cardController.showRandomCard);



/*  home fragment    */

//메인 화면 전체 카드 정보 받기
router.get('/getallcards/:user_idx', cardController.getAllCards);

//메인 화면 랜덤 문장 출력
router.get('/getrandomsentence', cardController.getRandomSentence);

//확인 버튼 누르면 진행상황 +1된거 서버로 보내기 -> 만약 모두 달성했을 경우 past로 바꾸기
router.put('/addachievecount', cardController.addAchieveCount);

//미션 포기
router.post('/giveup', cardController.giveupMission);



/*  past fragment    */

//지난 카드 전체 확인
router.get('/getallpastcards/:user_idx', cardController.getAllPastCards);



module.exports = router;