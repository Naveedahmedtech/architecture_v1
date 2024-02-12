const parseTagsId = async (tagIds) => {
  let ids;
  try {
    // Try parsing as JSON array
    ids = JSON.parse(tagIds);
  } catch {
    // If not JSON, assume comma-separated string
    ids = tagIds.split(",").map(Number);
  }
  return ids;
};

module.exports = {
  parseTagsId,
};
