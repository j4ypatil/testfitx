export default function TextInput({ value, onChange, placeholder, type = 'text', suffix }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 bg-light-card border border-light-border rounded-2xl px-5 py-4 focus-within:border-accent transition-colors">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-foreground text-xl font-semibold outline-none placeholder:text-light-muted/50"
          autoFocus
        />
        {suffix && (
          <span className="text-light-muted font-medium text-lg">{suffix}</span>
        )}
      </div>
    </div>
  );
}
