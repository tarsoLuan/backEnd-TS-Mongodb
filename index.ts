import express from 'express';
import session from 'express-session';
import jwt from 'jsonwebtoken'
import studentsRoutes from './assets/routes/studentsRoutes'
import managementRoutes from './assets/routes/managementRoutes'
import chatRoutes from './assets/routes/chatRoutes'
import ChatController from './assets/controllers/chatController';
import friendsRoutes from './assets/routes/friendsRoutes'
import { sequelize } from './assets/database/db';
import { SocketDataChat } from './assets/interfaces/SocketInterface';
import { Server } from "socket.io";
import http from 'http';

//npx tsx ./index.ts

const chatCtrl = new ChatController();

function start(){
	const port = 3333
	const app = express()

	const server = http.createServer(app);
	const io = new Server<SocketDataChat>(server);

	app.locals.io = io;

	sequelize.sync().then((result) => {
		console.log(result);
	}).catch((err) => {
		console.log(err);
	});

	app.use(
		express.urlencoded({
			extended:true
		})
	)
	app.use(express.json())

	function VerifyJWT(req, res, next){
		const token = req.body.token || req.query.token

		if(!token){
			return res.status(403).json({auth:false, message: 'No token provided'})
		}

		jwt.verify(token, 'secret_key', (err, user)=>{
			if(err){
			return res.status(403).json({message: 'Invalid Token'})
			}
			req.user = user
			next()
		})
	}

	app.use(express.static(__dirname + '/assets'))
	app.use('/', managementRoutes)
	app.use('/students', studentsRoutes)
	app.use('/chat', chatRoutes)
	app.use('/friends', friendsRoutes)


	io.on('connection', (socket) => {
		console.log("Usuário se conectou.")
	
		socket.on('SEND_MESSAGE', (data) => {
		  const { message, user_sender, user_receptor, prediction } = data;
		  console.log('message =>', message);
		  chatCtrl.sendMessage(message, user_sender, user_receptor, prediction)
	
		  io.emit('RECEIVE_MESSAGE', data)
		})

		socket.on('SEND_UPDATE_CHAT', (data) => {
			io.emit('RECEIVE_UPDATE_CHAT', {
			  user_sender: data.user_id,
			  user_receptor: data.friend_id,
			})
		})
	})	
	
	server.listen(port,()=>{
		console.log(`Running at port: ${port}`)
	})
}

start();