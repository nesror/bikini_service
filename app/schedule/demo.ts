import { Subscription, Application } from 'egg';

export default (app: Application) =>
    class Demo extends Subscription {
        public static get schedule() {
            return {
                interval: '9s',
                type: 'worker',
                disable: !app.config.subscriptionTest
            };
        }
        public async subscribe() {
            const { service } = this;
            service.cache.set('Subscription', new Date().getTime());
        }
    };
