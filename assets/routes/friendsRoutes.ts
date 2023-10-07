import * as express from 'express';
import RegisterController from '../controllers/registerController';

const router = express.Router();

router.get('/:id', RegisterController.getFriends);

export default router;