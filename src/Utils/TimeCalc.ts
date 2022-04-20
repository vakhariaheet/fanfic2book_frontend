import moment from 'moment';
/**
 *
 * @param date {string} YYYY-MM-DD
 * @returns string
 */
const timeCalc = (date: string) => {
	const start_date = moment(date, 'YYYY-MM-DD');
	const end_date = moment();
	const duration = moment.duration(end_date.diff(start_date));
	const years = Number(duration.asYears().toFixed());
	const months = Number(duration.asMonths().toFixed());
	const days = Number(duration.asDays().toFixed());
	const hours = Number(duration.asHours().toFixed());
	const minutes = Number(duration.asMinutes().toFixed());
	const seconds = Number(duration.asSeconds().toFixed());
	// moment.tz(timestamp, timezone).format(`lll`)
	if (years > 0) return `${years} years ago`;
	if (months > 0) return `${months} months ago`;
	if (days > 0) return `${days} days ago`;
	if (hours > 0) return `${hours} hours ago`;
	if (minutes > 0) return `${minutes} minutes ago`;
	if (seconds > 0) return `${seconds} seconds ago`;

	return days;
};
export default timeCalc;
