const { expect } = require("chai");
const sinon = require("sinon");
const officeService = require("../../services/office.service");
const Office = require("../../models/office.model");
const common = require("../../utils/common");
const commonValidate = require("../../middlewares/validators/common/common.validator");

describe("Test getAllOffice ", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it should return offices", async () => {
        const offices = [
            {
                officeCode: "1",
                city: "San Francisco",
                phone: "+1 650 219 4782",
                addressLine1: "100 Market Street",
                addressLine2: "Suite 300",
                state: "CA",
                country: "USA",
                postalCode: "94080",
                territory: "NA",
                updated_by: null,
                created_by: 1002,
                updated_on: null,
                created_on: "2003-01-08T17:00:00.000Z",
            },
        ];

        const filters = {
            officeCode: "1",
        };
        sinon.replace(common, "getAllAnyResource", sinon.fake.returns(offices));
        sinon.replace(commonValidate, "ResArrValidate", sinon.fake.returns(true));
        const result = await officeService.getAllOffice(filters);
        expect(result).to.be.an("array");
    });

    it("it should return offices without filter", async () => {
        const offices = [
            {
                officeCode: "1",
                city: "San Francisco",
                phone: "+1 650 219 4782",
                addressLine1: "100 Market Street",
                addressLine2: "Suite 300",
                state: "CA",
                country: "USA",
                postalCode: "94080",
                territory: "NA",
                updated_by: null,
                created_by: 1002,
                updated_on: null,
                created_on: "2003-01-08T17:00:00.000Z",
            },
        ];

        const filters = {};
        sinon.replace(common, "getAllAnyResource", sinon.fake.returns(offices));
        sinon.replace(commonValidate, "ResArrValidate", sinon.fake.returns(true));
        const result = await officeService.getAllOffice(filters);
        expect(result).to.be.an("array");
    });
});

describe("Test getOfficeByOfficeCode", () => {
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
        sinon.replace(Office, "query", fnMock);
        const result = await officeService.getOfficeByOfficeCode(1235);
        expect(result).to.be.true;
    });
});

describe("Test createOffice", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it will create successfully", async () => {
        sinon.replace(common, "checkDuplicateOfficeCode", sinon.fake.returns(true));
        const fnMock = () => {
            return {
                insert: sinon.fake.returns(true),
            };
        };
        sinon.replace(Office, "query", fnMock);
        const result = await officeService.createOffice(1235);
        expect(result).to.be.true;
    });
});

describe("Test updateOffice", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it will update successfully", async () => {
        sinon.replace(common, "checkValidOfficeCode", sinon.fake.returns(true));
        const fnMock = () => {
            return {
                update: () => {
                    return {
                        where: sinon.fake.returns(true),
                    };
                },
            };
        };
        sinon.replace(Office, "query", fnMock);
        const result = await officeService.updateOffice({ a: 1, b: "aaaa" });
        expect(result).to.be.true;
    });
});

describe("Test deleteProduct", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it will delete successfully", async () => {
        sinon.replace(common, "checkValidOfficeCode", sinon.fake.returns(true));
        const fnMock = () => {
            return {
                delete: () => {
                    return {
                        where: sinon.fake.returns(true),
                    };
                },
            };
        };
        sinon.replace(Office, "query", fnMock);
        const result = await officeService.deleteOffice("1");
        expect(result).to.be.true;
    });
});
