
import express from 'express'
import { SentEmailController } from '../controller/email/sent/SentEmailController';


const router = express.Router();


let emailController = new SentEmailController()

router.get('/sent_email', emailController.sentEmail)



export default router