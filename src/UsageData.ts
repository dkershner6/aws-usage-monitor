import moment from 'moment';
import CONFIG, { CostCantBe } from './CONFIG';

export default class UsageData {
    service: string;
    metrics = new Array<IMetric>();
    isAProblem = false;
    problemMessages = new Array<string>();

    constructor(service: string) {
        this.service = service;
    }

    addMetric(metric: IMetric): void {
        this.metrics.push(metric);
    }

    evaluate(): void {
        this.sortByStartDateAsc();

        if (CONFIG.costCantBe === CostCantBe.ABOVE_ZERO) {
            this.metrics.forEach((metric) => {
                if (metric.metric === 'BlendedCost' && metric.value > 0) {
                    this.isAProblem = true;
                    this.problemMessages.push(`Service ${this.service} spent more than $0 on ${metric.timePeriod.Start}`);
                }
            });
        }
    }

    private sortByStartDateAsc(): void {
        this.metrics = this.metrics.sort((a, b) => {
            const aStart = moment(a.timePeriod.Start);
            const bStart = moment(b.timePeriod.Start);
            if (aStart.isBefore(bStart)) {
                return -1;
            } else if (aStart.isAfter(bStart)) {
                return 1;
            }

            return 0;
        });
    }

    static async reactToProblem(problemMessages: string[]): Promise<void> {
        // Put reaction here
    }
}

export interface IMetric {
    timePeriod: AWS.CostExplorer.DateInterval;
    metric: string;
    value: number;
}
