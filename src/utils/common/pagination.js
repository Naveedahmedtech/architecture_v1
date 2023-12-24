const getPaginationInfo = (totalRows, page, limit) => {
  return {
    totalItems: totalRows,
    totalPages: Math.ceil(totalRows / limit),
    currentPage: page,
  };
};


module.exports = {
  getPaginationInfo,
};
