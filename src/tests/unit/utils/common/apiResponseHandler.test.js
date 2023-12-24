const { responseHandler } = require("../../../../utils/common/apiResponseHandler");

const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({ json: mockJson }));
const mockRes = { status: mockStatus };

describe("responseHandler", () => {
  beforeEach(() => {
    mockJson.mockClear();
    mockStatus.mockClear();
  });
  it("sends correct response structure", () => {
    const testMessage = "Test message";
    const testResult = { key: "value" };
    const testStatus = 200;
    const success = true;

    responseHandler(mockRes, testStatus, success, testMessage, testResult);

    expect(mockStatus).toHaveBeenCalledWith(testStatus);
    expect(mockJson).toHaveBeenCalledWith({
      status: success,
      message: testMessage,
      result: testResult,
    });
  });

  it("sends response without result if result is not provided", () => {
    const testMessage = "Another test message";
    const testStatus = 404;
    const success = false;

    responseHandler(mockRes, testStatus, success, testMessage);

    expect(mockStatus).toHaveBeenCalledWith(testStatus);
    expect(mockJson).toHaveBeenCalledWith({
      status: success,
      message: testMessage,
    });
  });
});
