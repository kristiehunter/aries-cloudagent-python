const chai = require("chai");
// @ts-ignore
const chaiHttp = require("chai-http");

process.env.NODE_ENV = "test";

chai.use(chaiHttp);

const should = chai.should();
const assert = chai.assert;
const expect = chai.expect;

describe("Server should be up and running", () => {
    it("Should return successful", (done) => {
        chai.request("localhost:5000")
            .post("/test")
            .end((err, res) => {
                if (err) {
                    console.log(err);
                }
                res.should.have.status(200);
            done();
            });
    });
});
