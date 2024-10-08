import { Service } from 'typedi';
import { COMMAND_REDIS_CHANNEL } from '../../redis/redis-constants';
import { OrchestrationHandlerService } from '../../orchestration.handler.base.service';
import { handleCommandMessageWebhook } from './handle-command-message-webhook';

@Service()
export class OrchestrationHandlerWebhookService extends OrchestrationHandlerService {
	async initSubscriber() {
		this.redisSubscriber = await this.redisService.getPubSubSubscriber();

		await this.redisSubscriber.subscribeToCommandChannel();

		this.redisSubscriber.addMessageHandler(
			'OrchestrationMessageReceiver',
			async (channel: string, messageString: string) => {
				if (channel === COMMAND_REDIS_CHANNEL) {
					await handleCommandMessageWebhook(messageString);
				}
			},
		);
	}
}
