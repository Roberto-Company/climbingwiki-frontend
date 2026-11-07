import { useTranslations } from "next-intl";
import type { CommentResponse, UserResponse } from "@/lib/types";
import type { Session } from "@/lib/auth/session";
import { canModify } from "@/lib/auth/roles";
import { EmptyState } from "@/components/catalog/EmptyState";
import { CommentItem, type CommentAuthor } from "./CommentItem";

type Props = {
  comments: CommentResponse[];
  /** Comment authors by user id; a missing author shows as a deleted user. */
  authors: ReadonlyMap<number, UserResponse>;
  session: Session | null;
};

export function CommentList({ comments, authors, session }: Props) {
  const t = useTranslations("Personal.comments");

  if (comments.length === 0) {
    return <EmptyState message={t("empty")} />;
  }

  const topLevel = comments.filter((comment) => comment.parentCommentId === null);
  const repliesByParent = new Map<number, CommentResponse[]>();
  for (const comment of comments) {
    if (comment.parentCommentId === null) {
      continue;
    }
    const existing = repliesByParent.get(comment.parentCommentId) ?? [];
    repliesByParent.set(comment.parentCommentId, [...existing, comment]);
  }

  return (
    <div className="flex flex-col gap-3">
      {topLevel.map((comment) => {
        const replies = repliesByParent.get(comment.id) ?? [];
        return (
          <div key={comment.id} className="flex flex-col gap-2">
            <CommentItem comment={comment} author={authorOf(authors, comment.userId)} canModify={canModify(session, comment.userId)} />
            {replies.length > 0 && (
              <div className="ml-6 flex flex-col gap-2 border-l border-border pl-4">
                {replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} author={authorOf(authors, reply.userId)} canModify={canModify(session, reply.userId)} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Only what the comment needs, so the full user (email for admins) never reaches the browser. */
function authorOf(authors: ReadonlyMap<number, UserResponse>, userId: number): CommentAuthor | null {
  const user = authors.get(userId);
  return user ? { id: user.id, username: user.username, fullName: user.fullName, avatarUrl: user.avatarUrl } : null;
}
