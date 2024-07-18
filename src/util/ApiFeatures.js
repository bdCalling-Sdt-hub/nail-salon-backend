class ApiFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr= queryStr;
    }

    search(fields = []) {
        const keyword = this.queryStr.keyword && fields.length > 0 ? {
            $or: fields.map(field => ({
                [field]: {
                    $regex: this.queryStr.keyword,
                    $options: "i"
                }
            }))
        } : {};
        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy ={...this.queryStr};

        // remove fields from the query;
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(el=> delete removeFields[el]);

        // advance filter for pricing, rating etc; price[gte]=100&price[lte]=1000  
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        this.query = this.query.find(JSON.parse(queryStr)); 
        return this;
    }

    pagination(pageLimit){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = pageLimit * (currentPage - 1);
        this.query = this.query.limit(pageLimit).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;