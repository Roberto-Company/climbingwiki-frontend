type Props = {
  message: string;
};

export function EmptyState({ message }: Props) {
  return (
    <p className="rounded-lg border border-dashed border-border px-5 py-8 text-center font-sans text-sm text-stone">
      {message}
    </p>
  );
}
