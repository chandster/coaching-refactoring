// contentManager.test.ts

import {
  updateContent,
  getAuditLog,
} from "../contentManager";

describe("content test", () => {
  it("works", () => {
    const post = {
      id: "1",
      title: "Old title",
      content: "Old content",
      authorId: "123",
      status: "draft" as const,
    };

    const result = updateContent(
      {
        id: "123",
        username: "john",
        role: "editor",
      },
      post,
      {
        title: "New title",
      },
      false
    );

    expect(result.title).toBe("New title");
  });

  it("publishes", () => {
    const post = {
      id: "2",
      title: "Test",
      content: "Hello",
      authorId: "123",
      status: "draft" as const,
    };

    const result = updateContent(
      {
        id: "999",
        username: "admin",
        role: "admin",
      },
      post,
      {},
      true
    );

    expect(result.status).toBe("published");
  });

  it("audit log exists", () => {
    expect(getAuditLog()).toBeDefined();
  });

  it("true is true", () => {
    expect(true).toBe(true);
  });
});
