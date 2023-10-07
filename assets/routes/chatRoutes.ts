import * as express from 'express';
import ChatController from '../controllers/chatController';

const chatCtrl = new ChatController();
const router = express.Router();

router.get('/', async (req, res) => {
    console.log('ernesto')
    console.log('req.query =>', req.query);
    const result = await chatCtrl.loadMessage(Number(req.query.page), Number(req.query.limit), Number(req.query.user_consumer), Number(req.query.user_receiver));
    console.log('result =>', result);
    res.json(result);
});

export default router;