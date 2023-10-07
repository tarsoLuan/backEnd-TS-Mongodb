import {Chat} from '../model/chat'

const spawner = require('child_process').spawn;
const { Op } = require("sequelize");

export default class ChatController {

    generatePagination(page:number, limit:number) {
        const _limit = limit || 10;
        const _page = page || 1;

        return {
            offset: (_page - 1) * _limit,
            limit: _limit
        }
    }

    async sendMessage(message:string, user_consumer:number, user_receiver:number, prediction:boolean) {
        await this.insertMessage(message, user_consumer, user_receiver, prediction);
    }

    async loadMessage(page:number=10, _limit:number=10, user_consumer:number, user_receiver:number) {
        const {offset, limit} = this.generatePagination(page, _limit);

        console.log('user_consumer =>', user_consumer);
        console.log('user_receiver =>', user_receiver);

        //sem paginação

        const chat = await Chat.findAll({
            where: {
                [Op.or]: [
                    {user_consumer: user_consumer,
                    user_receiver: user_receiver},
                    {user_consumer: user_receiver,
                    user_receiver: user_consumer},
                ]
                
            },
            order: [
                ['createdAt', 'ASC']
            ],
    
        });
        const total = await Chat.count();
        const count = Math.ceil(total / limit);

        return {
            rows: chat,
            count: count,
            status: 200
        }
    }

    async insertMessage (message:string, user_consumer:number, user_receiver:number, prediction:boolean) {     
        const chat = await Chat.create({
            user_consumer: user_consumer,
            user_receiver: user_receiver,
            message: message,
            prediction: prediction
        }); 
    }

    async predict(message:string) {
        return new Promise((resolve, reject) => {
            console.log('message =>', message);
            const pythonProcess = spawner('python', ['assets/pythonFiles/chat.py', message]);
            var result = ''

            pythonProcess.stdout.on('data', (data:any) => {
                result += data.toString()
            });
            pythonProcess.on('close', function(code) {
                resolve(result)
            });
            pythonProcess.on('error', function(err) { 
                reject(err)
             })
        }); 

    }
}



