export default class UrlServices {

    obtainLimitFromRequest(req) {
        let limit = req.query.limit;
        if (!limit) {
            // Limit of 100 unless otherwise given
            limit = 100;
        } else {
            try {
                limit = parseInt(limit);
            } catch (e) {
                console.log('Error parsing limit to number');
                limit = 100;
            }
        }
        return limit;
    }
}
