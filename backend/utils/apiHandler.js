const apiHandler = async (Model, req, res, searchFields = []) => {
  try {
    const { page = 1, limit = 10, search, sort, ...filters } = req.query;

    // Build Query
    let query = {};

    // Search Logic
    if (search && searchFields.length > 0) {
      query.$or = searchFields.map(field => ({
        [field]: { $regex: search, $options: 'i' }
      }));
    }

    // Filter Logic (Exact match for other params)
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        query[key] = filters[key];
      }
    });

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortQuery = { createdAt: -1 }; // Default sort
    if (sort) {
      const parts = sort.split(':');
      sortQuery = { [parts[0]]: parts[1] === 'desc' ? -1 : 1 };
    }

    // Execute Query
    const totalDocs = await Model.countDocuments(query);
    const docs = await Model.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum)
      .populate(Model.modelName === 'Complaint' || Model.modelName === 'Leave' ? 'studentId' : '');

    res.json({
      data: docs,
      meta: {
        total: totalDocs,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalDocs / limitNum)
      }
    });
  } catch (error) {
    console.error(`API Error for ${Model.modelName}:`, error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = apiHandler;
