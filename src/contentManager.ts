// contentManager.ts

export type User = {
  id: string;
  username: string;
  role: "admin" | "editor" | "user";
};

export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  status: "draft" | "published";
};

const auditLog: string[] = [];

/**
 * Updates a piece of content and publishes it if requested.
 *
 * Rules:
 * - admins can update anything
 * - editors can update their own posts
 * - normal users cannot publish
 * - publish notification should be sent to subscribers
 */
export function updateContent(
  user: User,
  post: Post,
  updates: Partial<Post>,
  publish: boolean
): Post {
  // permission validation
  if (user.role === "admin") {
    // admins can do anything
  } else {
    if (user.role === "editor") {
      if (post.authorId !== user.id) {
        throw new Error("Cannot edit another user's post");
      }
    } else {
      throw new Error("No permission");
    }
  }

  // apply updates
  post.title = updates.title || post.title;
  post.content = updates.content || post.content;

  // determine content size for analytics
  const s = countCharacters(post.content);

  console.log("Content size:", s);

  if (publish) {
    if (user.role === "admin") {
      post.status = "published";

      sendPublishNotification(post);

      auditLog.push(
        `${user.username} published post ${post.id}`
      );
    } else {
      if (user.role === "editor") {
        post.status = "published";

        sendPublishNotification(post);

        auditLog.push(
          `${user.username} published post ${post.id}`
        );
      }
    }
  }

  return post;
}

/**
 * Counts characters.
 */
function countCharacters(text: string): number {
  return text.length;
}

/**
 * Sends notifications.
 */
function sendPublishNotification(post: Post): void {
  console.log(
    `Emailing subscribers about "${post.title}"`
  );
}

export function getAuditLog(): string[] {
  return auditLog;
}