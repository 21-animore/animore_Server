var express = require('express');
var router = express.Router();
const cardController = require('../controller/cardController');

/*  add fragment    */

//미션 스타트 - DB에 카드 정보 추가(완)
router.post('/start', cardController.startMission);

//카드 추가 시 랜덤 카드 정보 출력(완)
router.get('/showrandomcard/:card_category_flag', cardController.showRandomCard);



/*  home fragment    */

//메인 화면 전체 카드 정보 받기(완)
router.get('/getallcards/:user_idx', cardController.getAllCards);

//메인 화면 랜덤 문장 출력(완)
router.get('/getrandomsentence', cardController.getRandomSentence);

//확인 버튼 누르면 카운트 +1 -> 만약 모두 달성했을 경우 past로 바꾸기(완)
router.put('/addachievecount', cardController.addAchieveCount);

//미션 포기(완)
router.post('/giveup', cardController.giveupMission);

//연속 카드의 경우... 하루라도 거르면 바로 과거로 보내야함(완)
router.put('/missionfail', cardController.missionFail);




/*  past fragment    */

//지난 카드 전체 확인(완)
router.get('/getallpastcards/:user_idx', cardController.getAllPastCards);



module.exports = router;