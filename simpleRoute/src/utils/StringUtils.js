
export default class StringUtils {
	pretifyDateString(dateString) {
		// Change 2017-03-01T12:12:12.803Z to 2017-03-01 12:12:12
		let result = null;
		if(dateString) {
			result = dateString.replace('T', ' ').replace(/.\d{3}Z/, '');
		}
		return result;
	}
}