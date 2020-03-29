import AWS from 'aws-sdk';
import { calculateDateRangeBackFromToday } from './util/dates';
import UsageData from './UsageData';

export const processFunction = async (): Promise<void> => {
    const costExplorer = new AWS.CostExplorer({ region: 'us-east-1' });

    try {
        const usage = await costExplorer
            .getCostAndUsage({
                TimePeriod: calculateDateRangeBackFromToday(3),
                Granularity: 'DAILY',
                Metrics: ['BlendedCost'],
                GroupBy: [{ Type: 'DIMENSION', Key: 'SERVICE' }],
            })
            .promise();

        const usageData = calculateUsageDataByService(usage);
        usageData.forEach((usage) => {
            usage.evaluate();
        });

        const problemMessages = usageData
            .filter((usage) => usage.isAProblem)
            .map((usage) => usage.problemMessages)
            .flat();

        UsageData.reactToProblem(problemMessages);
    } catch (error) {
        console.error(error);
    }
};

const calculateUsageDataByService = (usage: AWS.CostExplorer.GetCostAndUsageResponse): UsageData[] => {
    const serviceMap = new Map<string, UsageData>();

    usage.ResultsByTime.forEach((result) => {
        result.Groups.forEach((group) => {
            const service = group.Keys[0];
            if (!serviceMap.has(service)) {
                serviceMap.set(service, new UsageData(service));
            }

            const serviceData = serviceMap.get(service);
            serviceData.addMetric({
                timePeriod: result.TimePeriod,
                metric: 'BlendedCost',
                value: Number.parseFloat(group.Metrics.BlendedCost.Amount),
            });
            serviceMap.set(service, serviceData);
        });
    });

    return [...serviceMap.values()];
};
