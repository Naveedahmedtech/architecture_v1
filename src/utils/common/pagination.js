const getPaginationInfo = (totalRows, page, limit, displayedItemsCount) => {
  return {
    totalItems: totalRows,
    totalPages: Math.ceil(totalRows / limit),
    currentPage: page,
    itemsPerPage: limit,
    displayedItemsCount,
  };
};


module.exports = {
  getPaginationInfo,
};
