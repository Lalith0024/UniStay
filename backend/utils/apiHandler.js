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

    // Fetch docs WITHOUT automatic population first to preserve original IDs
    let docs = await Model.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum)
      .lean(); // Use lean() for better performance and easier modification

    // Manual Population for Complaint and Leave models
    if (Model.modelName === 'Complaint' || Model.modelName === 'Leave') {
      const User = require('../models/user');
      const Student = require('../models/Student');

      docs = await Promise.all(docs.map(async (doc) => {
        // Get the original ID (could be Student ID or User ID)
        const originalId = doc.studentId;

        if (!originalId) return doc;

        let student = null;

        try {
          // 1. Try to find as Student first
          student = await Student.findById(originalId).select('name email room block phone department year');

          // 2. If not found, try to find as User (legacy data fix)
          if (!student) {
            const user = await User.findById(originalId);
            if (user && user.email) {
              // Find corresponding Student by email
              student = await Student.findOne({ email: user.email }).select('name email room block phone department year');
            }
          }
        } catch (err) {
          console.error('Error resolving student in apiHandler:', err);
        }

        // 3. Attach student data if found
        if (student) {
          doc.studentId = student;
        } else {
          // Fallback object if absolutely nothing found
          doc.studentId = {
            name: 'Unknown Student',
            email: 'N/A',
            room: 'N/A',
            block: '-'
          };
        }

        return doc;
      }));
    }

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
