import { Handler } from 'aws-lambda';
import { processFunction } from './function';

export const handler: Handler = async () => {
    await processFunction();
};
