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

    // Execute Query with proper population
    const totalDocs = await Model.countDocuments(query);

    let queryBuilder = Model.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);

    // Populate studentId for Complaint and Leave models with specific fields
    if (Model.modelName === 'Complaint' || Model.modelName === 'Leave') {
      queryBuilder = queryBuilder.populate('studentId', 'name email room block phone department year');
    }

    let docs = await queryBuilder;

    // Handle cases where studentId might be a User ID instead of Student ID
    if (Model.modelName === 'Complaint' || Model.modelName === 'Leave') {
      const User = require('../models/user');
      const Student = require('../models/Student');

      // Check each document and fix missing student data
      docs = await Promise.all(docs.map(async (doc) => {
        const docObj = doc.toObject();

        // If studentId is not populated or missing name, try to find student by User ID
        if (!docObj.studentId || !docObj.studentId.name) {
          try {
            // Try to find User by the ID
            const user = await User.findById(doc.studentId);
            if (user && user.email) {
              // Find corresponding Student by email
              const student = await Student.findOne({ email: user.email });
              if (student) {
                docObj.studentId = {
                  _id: student._id,
                  name: student.name,
                  email: student.email,
                  room: student.room,
                  block: student.block,
                  phone: student.phone,
                  department: student.department,
                  year: student.year
                };
              }
            }
          } catch (err) {
            console.error('Error resolving student:', err);
          }
        }

        return docObj;
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
