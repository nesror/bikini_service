import { Application } from 'egg';

export default (app: Application) => {
    const { controller, router, ws } = app;

    router.get('/demo/:type', controller.demo.demo);

    router.get('/api/readInterview', controller.interview.readInterview);
    router.get('/api/readInterviews', controller.interview.readInterviews);
    router.post('/api/createInterview', controller.interview.createInterview);
    router.post('/api/updateInterview', controller.interview.updateInterview);

    // io.of('/').route('/api/ws/interview', controller.interview.interviewWebSocket);
    ws.route('/api/ws/interview', controller.interviewWs.interviewWebSocket);
};
