const { expect } = require("chai");
const sinon = require("sinon");
const productLineService = require("../../services/productLine.service");
const ProductLine = require("../../models/productlines.model");
const common = require("../../utils/common");
const commonValidate = require("../../middlewares/validators/common/common.validator");

describe("Test getAllProductLine ", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it should return list productLine", async () => {
        const filters = {
            current_page: 0,
            page_size: 10,
            sort_by: "employeeNumber",
            sort_type: "ASC",
        };
        sinon.replace(commonValidate, "ResArrValidate", sinon.fake.returns(true));
        sinon.replace(common, "getAllAnyResource", sinon.fake.returns(["a", "b"]));
        const result = await productLineService.getAllProductLine(filters);
        expect(result).to.be.an("array");
    });

    it("it should return list productLine without filters", async () => {
        const filters = {};
        sinon.replace(commonValidate, "ResArrValidate", sinon.fake.returns(true));
        sinon.replace(common, "getAllAnyResource", sinon.fake.returns(["a", "b"]));
        const result = await productLineService.getAllProductLine(filters);
        expect(result).to.be.an("array");
    });
});

describe("Test getProductLineByProductLine", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it will success", async () => {
        sinon.replace(common, "checkValidProductLine", sinon.fake.returns(true));
        sinon.replace(commonValidate, "ResByIDValidate", sinon.fake.returns(true));
        const fnMock = () => {
            return {
                findOne: sinon.fake.returns(true),
            };
        };
        sinon.replace(ProductLine, "query", fnMock);
        const result = await productLineService.getProductLineByProductLine(1235);
        expect(result).to.be.true;
    });
});

describe("Test creatProductLine", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it will create successfully", async () => {
        sinon.replace(common, "checkDuplicateProductLine", sinon.fake.returns(true));
        const fnMock = () => {
            return {
                insert: sinon.fake.returns(true),
            };
        };
        sinon.replace(ProductLine, "query", fnMock);
        const result = await productLineService.creatProductLine(1235);
        expect(result).to.be.true;
    });
});

describe("Test updateProductLine", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it will update successfully", async () => {
        sinon.replace(common, "checkValidProductLine", sinon.fake.returns(true));
        const fnMock = () => {
            return {
                update: () => {
                    return {
                        where: sinon.fake.returns(true),
                    };
                },
            };
        };
        sinon.replace(ProductLine, "query", fnMock);
        const result = await productLineService.updateProductLine({ a: 1, b: "aaaa" });
        expect(result).to.be.true;
    });
});

describe("Test deleteProduct", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it will delete successfully", async () => {
        sinon.replace(common, "checkValidProductLine", sinon.fake.returns(true));
        const fnMock = () => {
            return {
                delete: () => {
                    return {
                        where: sinon.fake.returns(true),
                    };
                },
            };
        };
        sinon.replace(ProductLine, "query", fnMock);
        const result = await productLineService.deleteProductLine({ a: 1, b: "aaaa" });
        expect(result).to.be.true;
    });
});
