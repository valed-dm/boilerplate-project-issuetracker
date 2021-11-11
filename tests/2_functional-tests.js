const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  let id1, id2;
  //#1
  test("POST to /api/issues/{project}. All fields are filled in", done => {
    chai
      .request(server)
      .post("/api/issues/my_tests")
      .send({
        issue_title: "All fields are filled in",
        issue_text: "POST to /api/issues/my_tests",
        created_by: "Dmitrii",
        assigned_to: "Dmitrii",
        status_text: "tracked"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, "All fields are filled in");
        assert.equal(res.body.issue_text, "POST to /api/issues/my_tests");
        assert.equal(res.body.created_by, "Dmitrii");
        assert.equal(res.body.assigned_to, "Dmitrii");
        assert.equal(res.body.status_text, "tracked");
        assert.equal(res.body.project, "my_tests");
        id1 = res.body._id;
        done();
      });
  });
  //#2
  test("POST to /api/issues/{project}. Required fields are filled in", done => {
    chai
      .request(server)
      .post("/api/issues/my_tests")
      .send({
        issue_title: "Required fields are filled in",
        issue_text: "POST to /api/issues/my_tests",
        created_by: "Valedinskii"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, "Required fields are filled in");
        assert.equal(res.body.issue_text, "POST to /api/issues/my_tests");
        assert.equal(res.body.created_by, "Valedinskii");
        assert.equal(res.body.assigned_to, "");
        assert.equal(res.body.status_text, "");
        id2 = res.body._id;
        done();
      });
  });
  //#3
  test("POST to /api/issues/{project}. Missing required fields", done => {
    chai
      .request(server)
      .post("/api/issues/my_tests")
      .send({
        issue_title: "required field(s) (one, two or all of 3) missing"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });
  //#4
  test("GET to /api/issues/{project}. View issues on a project", done => {
    chai
      .request(server)
      .get("/api/issues/my_tests")
      .query({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], "issue_title");
        assert.property(res.body[0], "issue_text");
        assert.property(res.body[0], "created_by");
        assert.property(res.body[0], "assigned_to");
        assert.property(res.body[0], "status_text");
        assert.property(res.body[0], "open");
        assert.property(res.body[0], "created_on");
        assert.property(res.body[0], "updated_on");
        assert.property(res.body[0], "project");
        assert.property(res.body[0], "_id");
        done();
      });
  });
  //#5
  test("GET to /api/issues/{project}. View issues on a project with one filter", done => {
    chai
      .request(server)
      .get("/api/issues/my_tests")
      .query({ created_by: "Dmitrii" })
      .end((err, res) => {
        res.body.forEach(issueFound => {
          assert.equal(issueFound.created_by, "Dmitrii");
        });
        done();
      });
  });
  //#6
  test("GET to /api/issues/{project}. View issues on a project with multiple filters", done => {
    chai
      .request(server)
      .get("/api/issues/my_tests")
      .query({ open: true, created_by: "Dmitrii" })
      .end((err, res) => {
        res.body.forEach(issueFound => {
          assert.equal(issueFound.open, true);
          assert.equal(issueFound.created_by, "Dmitrii");
        });
        done();
      });
  });
  //#7
  test("PUT to /api/issues/{project}. Update one field on an issue", done => {
    chai
      .request(server)
      .put("/api/issues/my_tests")
      .send({
        _id: id1,
        issue_text: "Update one field on an issue test"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.result, "successfully updated");
        done();
      });
  });
  //#8
  test("PUT to /api/issues/{project}. Update multiple fields on an issue", done => {
    chai
      .request(server)
      .put("/api/issues/my_tests")
      .send({
        _id: id1,
        issue_title: "multiple fields update test",
        issue_text: "Update multiple fields on an issue"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.result, "successfully updated");
        done();
      });
  });
  //#9
  test("PUT to /api/issues/{project}. Update an issue with missing _id", done => {
    chai
      .request(server)
      .put("/api/issues/my_tests")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
  //#10
  test("PUT to /api/issues/{project}. Update an issue with no fields to update", done => {
    chai
      .request(server)
      .put("/api/issues/my_tests")
      .send({
        _id: id1
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "no update field(s) sent");
        done();
      });
  });
  //#11
  test("PUT to /api/issues/{project}. Update an issue with an invalid _id", done => {
    chai
      .request(server)
      .put("/api/issues/my_tests")
      .send({
        _id: "13"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "invalid _id");
        done();
      });
  });
  //#12
  test("DELETE to /api/issues/{project}. Delete an issue", done => {
    chai
      .request(server)
      .delete("/api/issues/my_tests")
      .send({
        _id: id1
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, id1);
        chai
          .request(server)
          .delete("/api/issues/my_tests")
          .send({
            _id: id2
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.result, "successfully deleted");
            assert.equal(res.body._id, id2);
          });
        done();
      });
  });
  //#13
  test("DELETE to /api/issues/{project}. Delete an issue with an invalid _id", done => {
    chai
      .request(server)
      .delete("/api/issues/my_tests")
      .send({ _id: id1 })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "could not delete");
        done();
      });
  });
  //#14
  test("DELETE to /api/issues/{project}. Delete an issue with missing _id", done => {
    chai
      .request(server)
      .delete("/api/issues/my_tests")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});
