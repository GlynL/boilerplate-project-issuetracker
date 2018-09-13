require("isomorphic-fetch");

describe("POST /api/issues/{project} => object with issue data", () => {
  test("every field filled in", async () => {
    expect.assertions(9);
    const res = await fetch("http://localhost:8080/api/issues/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        issue_title: "Title",
        issue_text: "text",
        created_by: "Functional Test - Every field filled in",
        assigned_to: "Chai and Mocha",
        status_text: "In QA"
      })
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.issue_title).toBe("Title");
    expect(data.issue_text).toBe("text");
    expect(data.created_by).toBe("Functional Test - Every field filled in");
    expect(data.assigned_to).toBe("Chai and Mocha");
    expect(data.status_text).toBe("In QA");
    expect(data.created_on).toBeDefined();
    expect(data.updated_on).toBeDefined();
    expect(data.open).toBeTruthy();
  });
});

// suite('Functional Tests', function () {

//   suite('POST /api/issues/{project} => object with issue data', function () {

//     test('Every field filled in', function (done) {
//       chai.request(server)
//         .post('/api/issues/test')
//         .send({
//           issue_title: 'Title',
//           issue_text: 'text',
//           created_by: 'Functional Test - Every field filled in',
//           assigned_to: 'Chai and Mocha',
//           status_text: 'In QA'
//         })
//         .end(function (err, res) {
//           assert.equal(res.status, 200);

//           //fill me in too!

//           done();
//         });
//     });

//     test('Required fields filled in', function (done) {

//     });

//     test('Missing required fields', function (done) {

//     });

//   });

//   suite('PUT /api/issues/{project} => text', function () {

//     test('No body', function (done) {

//     });

//     test('One field to update', function (done) {

//     });

//     test('Multiple fields to update', function (done) {

//     });

//   });

//   suite('GET /api/issues/{project} => Array of objects with issue data', function () {

//     test('No filter', function (done) {
//       chai.request(server)
//         .get('/api/issues/test')
//         .query({})
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.isArray(res.body);
//           assert.property(res.body[0], 'issue_title');
//           assert.property(res.body[0], 'issue_text');
//           assert.property(res.body[0], 'created_on');
//           assert.property(res.body[0], 'updated_on');
//           assert.property(res.body[0], 'created_by');
//           assert.property(res.body[0], 'assigned_to');
//           assert.property(res.body[0], 'open');
//           assert.property(res.body[0], 'status_text');
//           assert.property(res.body[0], '_id');
//           done();
//         });
//     });

//     test('One filter', function (done) {

//     });

//     test('Multiple filters (test for multiple fields you know will be in the db for a return)', function (done) {

//     });

//   });

//   suite('DELETE /api/issues/{project} => text', function () {

//     test('No _id', function (done) {

//     });

//     test('Valid _id', function (done) {

//     });

//   });

// });
