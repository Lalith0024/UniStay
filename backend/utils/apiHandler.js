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

      // 1. Collect all unique IDs
      const allIds = [...new Set(docs.map(doc => doc.studentId).filter(id => id))];

      if (allIds.length > 0) {
        // 2. Batch fetch Students
        const students = await Student.find({ _id: { $in: allIds } })
          .select('name email room block phone department year')
          .lean();

        // Map for fast lookup
        const studentMap = new Map(students.map(s => [s._id.toString(), s]));

        // 3. Identify missing IDs (potential Users)
        const foundStudentIds = new Set(students.map(s => s._id.toString()));
        const missingIds = allIds.filter(id => !foundStudentIds.has(id.toString()));

        let userMap = new Map();
        let studentByEmailMap = new Map();

        // 4. Batch fetch Users if needed
        if (missingIds.length > 0) {
          const users = await User.find({ _id: { $in: missingIds } }).select('email').lean();
          const userEmails = users.map(u => u.email).filter(e => e);

          if (userEmails.length > 0) {
            const studentsByEmail = await Student.find({ email: { $in: userEmails } })
              .select('name email room block phone department year')
              .lean();

            // Map email -> Student
            studentsByEmail.forEach(s => studentByEmailMap.set(s.email, s));
            // Map UserID -> User Email
            users.forEach(u => userMap.set(u._id.toString(), u.email));
          }
        }

        // 5. Attach data to docs
        docs = docs.map(doc => {
          const idStr = doc.studentId ? doc.studentId.toString() : null;
          if (!idStr) return doc;

          // Try direct student match
          if (studentMap.has(idStr)) {
            doc.studentId = studentMap.get(idStr);
          }
          // Try User -> Email -> Student match
          else if (userMap.has(idStr)) {
            const email = userMap.get(idStr);
            if (studentByEmailMap.has(email)) {
              doc.studentId = studentByEmailMap.get(email);
            } else {
              doc.studentId = { name: 'Unknown Student', email: 'N/A', room: 'N/A', block: '-' };
            }
          }
          // Fallback
          else {
            doc.studentId = { name: 'Unknown Student', email: 'N/A', room: 'N/A', block: '-' };
          }
          return doc;
        });
      }
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
