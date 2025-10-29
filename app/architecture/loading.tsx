export default function ArchitectureLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        <p className="text-sm text-muted-foreground">Loading architecture...</p>
      </div>
    </div>
  )
}
