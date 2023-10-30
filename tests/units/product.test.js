const { expect } = require("chai");
const sinon = require("sinon");
const productService = require("../../services/product.service");
const Product = require("../../models/products.model");
const common = require("../../utils/common");
const commonValidate = require("../../middlewares/validators/common/common.validator");

describe("Test getAllProduct ", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it wil get list product", async () => {
        const filters = {
            current_page: 0,
            page_size: 10,
            sort_by: "employeeNumber",
            sort_type: "ASC",
        };
        sinon.replace(commonValidate, "ResArrValidate", sinon.fake.returns(true));
        sinon.replace(common, "getAllAnyResource", sinon.fake.returns(["a", "b"]));
        const result = await productService.getAllProduct(filters);
        expect(result).to.be.an("array");
    });

    it("it wil get list product without filters", async () => {
        const filters = {};
        sinon.replace(commonValidate, "ResArrValidate", sinon.fake.returns(true));
        sinon.replace(common, "getAllAnyResource", sinon.fake.returns(["a", "b"]));
        const result = await productService.getAllProduct(filters);
        expect(result).to.be.an("array");
    });
});

describe("Test getProductByProductCode", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it will success", async () => {
        sinon.replace(common, "checkValidProductCode", sinon.fake.returns(true));
        sinon.replace(commonValidate, "ResByIDValidate", sinon.fake.returns(true));
        const fnMock = () => {
            return {
                findOne: sinon.fake.returns(true),
            };
        };
        sinon.replace(Product, "query", fnMock);
        const result = await productService.getProductByProductCode(1235);
        expect(result).to.be.true;
    });
});

describe("Test creatProduct", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it will create successfully", async () => {
        sinon.replace(Promise, "all", sinon.fake.returns(true));
        const fnMock = () => {
            return {
                insert: sinon.fake.returns(true),
            };
        };
        sinon.replace(Product, "query", fnMock);
        const result = await productService.creatProduct(1235);
        expect(result).to.be.true;
    });
});

describe("Test updateProduct", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it will update successfully", async () => {
        sinon.replace(Promise, "all", sinon.fake.returns(true));
        const fnMock = () => {
            return {
                update: () => {
                    return {
                        where: sinon.fake.returns(true),
                    };
                },
            };
        };
        sinon.replace(Product, "query", fnMock);
        const result = await productService.updateProduct({ a: 1, b: "aaaa" });
        expect(result).to.be.true;
    });
});

describe("Test deleteProduct", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it will delete successfully", async () => {
        sinon.replace(common, "checkValidProductCode", sinon.fake.returns(true));
        const fnMock = () => {
            return {
                delete: () => {
                    return {
                        where: sinon.fake.returns(true),
                    };
                },
            };
        };
        sinon.replace(Product, "query", fnMock);
        const result = await productService.deleteProduct({ a: 1, b: "aaaa" });
        expect(result).to.be.true;
    });
});
