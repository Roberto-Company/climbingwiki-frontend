import { useTranslations } from "next-intl";
import type { CommentResponse } from "@/lib/types";
import type { Session } from "@/lib/auth/session";
import { canModify } from "@/lib/auth/roles";
import { EmptyState } from "@/components/catalog/EmptyState";
import { CommentItem } from "./CommentItem";

type Props = {
  comments: CommentResponse[];
  session: Session | null;
};

export function CommentList({ comments, session }: Props) {
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
            <CommentItem comment={comment} canModify={canModify(session, comment.userId)} />
            {replies.length > 0 && (
              <div className="ml-6 flex flex-col gap-2 border-l border-border pl-4">
                {replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} canModify={canModify(session, reply.userId)} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
