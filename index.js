import RedPanda from './src/RedPanda'

let api = new RedPanda()

api.send({url : 'https://ispeak.vn/api/top_student/1'}).then(() => console.log('done'))
