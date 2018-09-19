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

  test("Required fields filled in", async () => {
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
        assigned_to: "",
        status_text: ""
      })
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.issue_title).toBe("Title");
    expect(data.issue_text).toBe("text");
    expect(data.created_by).toBe("Functional Test - Every field filled in");
    expect(data.assigned_to).toBe("");
    expect(data.status_text).toBe("");
    expect(data.created_on).toBeDefined();
    expect(data.updated_on).toBeDefined();
    expect(data.open).toBeTruthy();
  });

  test("Missing required fields", async () => {
    expect.assertions(1);
    const res = await fetch("http://localhost:8080/api/issues/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        issue_title: "",
        issue_text: "",
        created_by: "",
        assigned_to: "",
        status_text: ""
      })
    });
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/issues/{project} => text", () => {
  test("no body", async () => {
    // 5b9e424725ece020a4d56c6f
    expect.assertions(1);
    const res = await fetch("http://localhost:8080/api/issues/test", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });
    expect(res.status).toBe(400);
  });
  test("no id", async () => {
    // 5b9e424725ece020a4d56c6f
    expect.assertions(1);
    const res = await fetch("http://localhost:8080/api/issues/test", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        issue_title: "new title"
      })
    });
    expect(res.status).toBe(400);
  });

  test("one field to update", async () => {
    expect.assertions(2);
    const res = await fetch("http://localhost:8080/api/issues/test", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        _id: "5b9e424725ece020a4d56c6f",
        issue_title: "new title"
      })
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.issue_title).toBe("new title");
  });

  test("multiple fields to update", async () => {
    expect.assertions(7);
    const res = await fetch("http://localhost:8080/api/issues/test", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        _id: "5b9e424725ece020a4d56c6f",
        issue_title: "new title",
        issue_text: "new text",
        created_by: "glyn",
        assigned_to: "new",
        status_text: "updated",
        open: false
      })
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.issue_title).toBe("new title");
    expect(data.issue_text).toBe("new text");
    expect(data.created_by).toBe("glyn");
    expect(data.assigned_to).toBe("new");
    expect(data.status_text).toBe("updated");
    expect(data.open).toBe(false);
  });
});

describe("GET /api/issues/{project} => array of objects with issue data", () => {
  test("no filter", async () => {
    expect.assertions(11);
    const res = await fetch("http://localhost:8080/api/issues/test");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toBeInstanceOf(Array);
    expect(data[0]).toHaveProperty("issue_title");
    expect(data[0]).toHaveProperty("issue_text");
    expect(data[0]).toHaveProperty("created_on");
    expect(data[0]).toHaveProperty("updated_on");
    expect(data[0]).toHaveProperty("created_by");
    expect(data[0]).toHaveProperty("assigned_to");
    expect(data[0]).toHaveProperty("open");
    expect(data[0]).toHaveProperty("status_text");
    expect(data[0]).toHaveProperty("_id");
  });

  test("one filter", async () => {
    expect.assertions(2);
    const res = await fetch(
      "http://localhost:8080/api/issues/test?assigned_to=new"
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[0].assigned_to).toBe("new");
  });

  test("Multiple filters (test for multiple fields you know will be in the db for a return)", async () => {
    expect.assertions(4);
    const res = await fetch(
      "http://localhost:8080/api/issues/test?assigned_to=new&created_by=glyn&open=false"
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[0].assigned_to).toBe("new");
    expect(data[0].created_by).toBe("glyn");
    expect(data[0].open).toBeFalsy();
  });
});

describe("DELETE /api/issues/{project} => text", () => {
  test("No _id", async () => {
    expect.assertions(2);
    const res = await fetch("http://localhost:8080/api/issues/test", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error.message).toBe("_id error");
  });

  test("valid id", async () => {
    expect.assertions(2);
    const res = await fetch("http://localhost:8080/api/issues/test", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringifiy({
        // ! can we set this dynamiclaly? otherwise wont' work everytime
        _id: "hmmmm"
      })
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    // todo: add id
    expect(data.message).toBe(`successfully deleted`);
  });
});
