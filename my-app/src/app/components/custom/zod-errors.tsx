export function ZodErrors({ error }: { error?: string[] }) {
  if (!error || error.length === 0) return null;
  return (
    <p style={{ color: "red", fontSize: 12, marginTop: 6 }}>
      {error[0]}
    </p>
  );
}
