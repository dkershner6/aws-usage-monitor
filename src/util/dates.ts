import AWS from 'aws-sdk';
import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

export const calculateDateRangeBackFromToday = (numberOfDays: number): AWS.CostExplorer.DateInterval => {
    const tomorrow = moment().add(1, 'day'); // End Date Is Exclusive
    const xDaysAgo = moment().subtract(numberOfDays, 'days');

    return {
        Start: xDaysAgo.format(DATE_FORMAT),
        End: tomorrow.format(DATE_FORMAT),
    };
};
